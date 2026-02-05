import type { Car } from "../data/cars"
import { isRealListingId } from "../utils/listings"
import "../styles/as24-listings.css"

interface AanbodCardProps {
  car: Car
}

/**
 * AutoScout24-style listing card using the original HTML wrapper from AS24
 */
export function AanbodCard({ car }: AanbodCardProps) {
  // If we have HTML wrapper, use it directly
  if (car.htmlWrapper) {
    // Process the HTML to make links point to our site
    let processedHtml = car.htmlWrapper;
    
    // Check if gallery wrapper is empty and add fallback image if needed
    // Handle both self-closing and empty divs with potential whitespace
    const emptyGalleryPattern = /<div class="dp-listing-item-gallery__picture-wrapper">\s*<\/div>/;
    const hasEmptyGallery = emptyGalleryPattern.test(processedHtml);
    if (hasEmptyGallery && car.imageUrl) {
      // Insert image into empty gallery wrapper
      const imageHtml = `<section class="dp-new-gallery__slider"><div class="dp-new-gallery__item"><picture class="dp-new-gallery__picture"><img src="${car.imageUrl}" class="dp-new-gallery__img" alt="${car.title.replace(/"/g, '&quot;')}" loading="lazy" /></picture></div></section>`;
      processedHtml = processedHtml.replace(
        emptyGalleryPattern,
        `<div class="dp-listing-item-gallery__picture-wrapper">${imageHtml}</div>`
      );
    }
    
    // Only real listing IDs have a detail page; mock cars link to the list
    const detailHref = isRealListingId(car.id) ? `/aanbod/${car.id}/` : "/aanbod/";
    const articleMatch = processedHtml.match(/^(<article[^>]*>)([\s\S]*)(<\/article>)$/);
    if (articleMatch) {
      const openingTag = articleMatch[1];
      const content = articleMatch[2];
      const closingTag = articleMatch[3];
      
      // Create a clickable wrapper
      processedHtml = `<a href="${detailHref}" class="as24-listing-link">${openingTag}${content}${closingTag}</a>`;
    }
    
    // Replace any remaining AutoScout24 links
    processedHtml = processedHtml.replace(
      /href="[^"]*autoscout24\.be[^"]*"/g,
      `href="${detailHref}"`
    );
    
    // Remove any onclick handlers and other interactive elements we don't need
    processedHtml = processedHtml.replace(/\s+onclick="[^"]*"/g, '');
    processedHtml = processedHtml.replace(/\s+tabindex="[^"]*"/g, '');
    processedHtml = processedHtml.replace(/\s+role="[^"]*button[^"]*"/g, '');
    
    return (
      <div 
        className="as24-listing-wrapper"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    );
  }

  // Fallback to custom rendering if no HTML wrapper
  const priceFormatted = new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(car.price)

  const titleWithFeatures =
    car.features.length > 0
      ? `${car.title} | ${car.features.slice(0, 6).join(" | ")}`
      : car.title

  const detailHref = isRealListingId(car.id) ? `/aanbod/${car.id}/` : "/aanbod/";
  return (
    <article className="bg-surface border border-border rounded overflow-hidden hover:border-ink/25 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-200">
      <a href={detailHref} className="flex flex-col sm:flex-row sm:min-h-0">
        <div className="relative w-full sm:w-52 shrink-0 aspect-[4/3] sm:aspect-auto sm:h-[188px] bg-border/50 overflow-hidden">
          <img
            src={car.imageUrl}
            alt={car.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h2 className="font-display font-semibold text-ink text-base sm:text-lg tracking-tight line-clamp-2">
              {titleWithFeatures}
            </h2>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display font-bold text-lg text-ink tracking-tight">
                {priceFormatted}
              </span>
            </div>
          </div>
        </div>
      </a>
    </article>
  )
}
