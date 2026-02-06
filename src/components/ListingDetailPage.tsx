import { useEffect, useState, useRef } from 'react';
import { fetchDetailPageHtmlClient } from '../utils/client-listing-detail';
import { fetchAllListingUrlsClient } from '../utils/client-listings';
import { extractIdFromListingUrl } from '../utils/listings';
import type { DetailPageResult } from '../utils/listing-detail';

interface ListingDetailPageProps {
  /** Optional - if not provided, ID is read from URL search params (?id=xxx) */
  id?: string;
}

export function ListingDetailPage({ id: propId }: ListingDetailPageProps) {
  const [detail, setDetail] = useState<DetailPageResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const galleryInitialized = useRef(false);

  // Get ID from prop or from URL search params (?id=xxx) for client-only routing
  const getActualId = (): string => {
    if (typeof window === 'undefined') return propId || '';
    const params = new URLSearchParams(window.location.search);
    const queryId = params.get('id');
    if (queryId) return queryId;
    return propId || '';
  };

  const id = getActualId();

  useEffect(() => {
    async function fetchDetail() {
      try {
        setIsLoading(true);
        setError(null);

        if (!id) {
          setError('Geen voertuig ID opgegeven. Gebruik /aanbod/detail?id=xxx');
          setIsLoading(false);
          return;
        }

        // First, try to find the listing URL from all listings
        // This handles both UUID and slug IDs
        let listingUrl: string | null = null;

        try {
          // Fetch only listing URLs (much faster than fetching all details)
          const listingUrls = await fetchAllListingUrlsClient();
          console.log(`[ListingDetailPage] Fetched ${listingUrls.length} listing URLs, looking for ID: ${id}`);
          
          const matchingUrl = listingUrls.find((url) => {
            const listingId = extractIdFromListingUrl(url);
            return listingId === id;
          });

          if (matchingUrl) {
            listingUrl = matchingUrl;
            console.log(`[ListingDetailPage] Found matching listing: ${listingUrl}`);
          } else {
            console.warn(`[ListingDetailPage] No matching listing found for ID: ${id}`);
            setError('Voertuig niet gevonden. Het kan zijn dat dit voertuig niet meer beschikbaar is.');
            setIsLoading(false);
            return;
          }
        } catch (listingsError) {
          console.error('[ListingDetailPage] Error fetching listing URLs:', listingsError);
          setError('Kon lijst met voertuigen niet ophalen. Probeer het later opnieuw.');
          setIsLoading(false);
          return;
        }

        if (!listingUrl) {
          setError('Kon voertuig URL niet vinden.');
          setIsLoading(false);
          return;
        }

        // Fetch detail page
        console.log(`[ListingDetailPage] Fetching detail page for: ${listingUrl}`);
        const detailData = await fetchDetailPageHtmlClient(listingUrl);
        console.log(`[ListingDetailPage] Detail page fetched successfully`);
        setDetail(detailData);
        setFetchedAt(new Date().toLocaleString('nl-BE', { 
          dateStyle: 'medium', 
          timeStyle: 'medium' 
        }));
      } catch (e) {
        console.error('[ListingDetailPage] Error fetching detail page:', e);
        setError(
          e instanceof Error 
            ? `Fout: ${e.message}` 
            : 'Kon detailpagina niet laden. Probeer het later opnieuw.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  // Initialize gallery JavaScript when images are available
  useEffect(() => {
    if (!detail?.images || detail.images.length === 0 || galleryInitialized.current) {
      return;
    }

    const gallery = document.querySelector('.detail-gallery');
    if (!gallery) return;

    galleryInitialized.current = true;

    const mainWrap = gallery.querySelector('.detail-gallery-main-wrap');
    const mainImg = gallery.querySelector('.detail-gallery-img') as HTMLImageElement | null;
    const thumbs = Array.from(gallery.querySelectorAll('.detail-gallery-thumb'));
    const lightbox = document.getElementById('detail-gallery-lightbox');
    const lightboxImg = document.getElementById('detail-gallery-lightbox-img') as HTMLImageElement | null;
    const lightboxPrev = lightbox?.querySelector('.detail-gallery-lightbox-prev');
    const lightboxNext = lightbox?.querySelector('.detail-gallery-lightbox-next');
    const lightboxClose = lightbox?.querySelector('.detail-gallery-lightbox-close');
    const images = detail.images;
    let currentIndex = 0;

    function setIndex(i: number) {
      if (images.length === 0) return;
      currentIndex = (i + images.length) % images.length;
      if (mainImg) mainImg.src = images[currentIndex];
      thumbs.forEach((t, idx) => t.classList.toggle('is-active', idx === currentIndex));
      const activeThumb = thumbs[currentIndex];
      if (activeThumb) activeThumb.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      if (lightbox?.classList.contains('is-open') && lightboxImg) lightboxImg.src = images[currentIndex];
    }

    thumbs.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index') ?? '0', 10);
        setIndex(idx);
      });
    });
    thumbs[0]?.classList.add('is-active');

    const prevBtn = mainWrap?.querySelector('.detail-gallery-arrow-prev');
    const nextBtn = mainWrap?.querySelector('.detail-gallery-arrow-next');
    prevBtn?.addEventListener('click', () => setIndex(currentIndex - 1));
    nextBtn?.addEventListener('click', () => setIndex(currentIndex + 1));

    mainImg?.addEventListener('click', () => {
      if (images.length === 0 || !lightbox || !lightboxImg) return;
      lightboxImg.src = images[currentIndex];
      lightbox.setAttribute('aria-hidden', 'false');
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });

    function closeLightbox() {
      if (!lightbox) return;
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => { 
      if (e.target === lightbox) closeLightbox(); 
    });
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox?.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') setIndex(currentIndex - 1);
      else if (e.key === 'ArrowRight') setIndex(currentIndex + 1);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    lightboxPrev?.addEventListener('click', (e) => { 
      e.stopPropagation(); 
      setIndex(currentIndex - 1); 
    });
    lightboxNext?.addEventListener('click', (e) => { 
      e.stopPropagation(); 
      setIndex(currentIndex + 1); 
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [detail?.images]);

  if (isLoading) {
    return (
      <section className="py-6 sm:py-10 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center py-12">
            <p className="font-body text-muted">Laden...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !detail) {
    return (
      <section className="py-6 sm:py-10 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-red-50 border border-red-200 rounded p-6">
            <h2 className="font-display font-semibold text-red-900 mb-2">Fout</h2>
            <p className="font-body text-red-800 mb-4">{error || 'Kon detailpagina niet laden.'}</p>
            <a 
              href="/aanbod/" 
              className="font-body text-sm text-red-700 hover:text-red-900 underline"
            >
              ← Terug naar aanbod
            </a>
          </div>
        </div>
      </section>
    );
  }

  const pipeIndex = detail.title.indexOf('|');
  const titleParts = pipeIndex > 0
    ? {
        firstPart: detail.title.substring(0, pipeIndex).trim(),
        rest: detail.title.substring(pipeIndex).trim(),
      }
    : null;

  return (
    <>
      <section className="bg-bg py-4 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <a href="/aanbod/" className="font-body text-sm text-muted hover:text-ink transition">
            ← Terug naar aanbod
          </a>
          {fetchedAt && (
            <p className="font-body text-xs text-muted mt-2">
              Gegevens opgehaald op: {fetchedAt}
            </p>
          )}
        </div>
      </section>
      <section className="py-6 sm:py-10 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className={`detail-hero ${!(detail.images && detail.images.length > 0) ? 'detail-hero-no-gallery' : ''}`}>
            {detail.images && detail.images.length > 0 && (
              <aside className="detail-gallery" data-image-count={detail.images.length}>
                <div className="detail-gallery-main-wrap">
                  <div className="detail-gallery-main">
                    <img
                      src={detail.images[0]}
                      alt={detail.title}
                      className="detail-gallery-img"
                      width={720}
                      height={540}
                      loading="eager"
                      fetchPriority="high"
                      tabIndex={0}
                    />
                  </div>
                  {detail.images.length > 1 && (
                    <>
                      <button 
                        type="button" 
                        className="detail-gallery-arrow detail-gallery-arrow-prev" 
                        aria-label="Vorige afbeelding"
                      >
                        <span aria-hidden="true">‹</span>
                      </button>
                      <button 
                        type="button" 
                        className="detail-gallery-arrow detail-gallery-arrow-next" 
                        aria-label="Volgende afbeelding"
                      >
                        <span aria-hidden="true">›</span>
                      </button>
                    </>
                  )}
                </div>
                {detail.images.length > 1 && (
                  <div className="detail-gallery-thumbs">
                    {detail.images.map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        className="detail-gallery-thumb"
                        data-index={i}
                        aria-label={`Afbeelding ${i + 1}`}
                      >
                        <img src={src} alt="" width={120} height={90} loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
              </aside>
            )}
            <div className="detail-summary">
              <h1 className="detail-summary-title">
                {titleParts ? (
                  <>
                    <strong>{titleParts.firstPart}</strong>
                    <br />
                    {titleParts.rest}
                  </>
                ) : (
                  detail.title
                )}
              </h1>
              <div className="detail-under-construction">
                <p>Deze pagina is momenteel in aanbouw.</p>
                <p>Binnenkort vindt u hier alle details over dit voertuig.</p>
              </div>
            </div>
          </div>
          {/* Lightbox */}
          {detail.images && detail.images.length > 0 && (
            <div className="detail-gallery-lightbox" id="detail-gallery-lightbox" aria-hidden="true">
              <button 
                type="button" 
                className="detail-gallery-lightbox-close" 
                aria-label="Sluiten"
              >
                ×
              </button>
              <button 
                type="button" 
                className="detail-gallery-lightbox-prev" 
                aria-label="Vorige afbeelding"
              >
                ‹
              </button>
              <div className="detail-gallery-lightbox-img-wrap">
                <img 
                  src="" 
                  alt="" 
                  className="detail-gallery-lightbox-img" 
                  id="detail-gallery-lightbox-img" 
                />
              </div>
              <button 
                type="button" 
                className="detail-gallery-lightbox-next" 
                aria-label="Volgende afbeelding"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
