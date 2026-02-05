import type { APIRoute } from 'astro';
import { fetchAllListings } from '../../utils/fetch-listings';

export const GET: APIRoute = async () => {
  try {
    console.log('Fetching all listings...');
    const listings = await fetchAllListings();
    console.log(`Successfully fetched ${listings.length} listings`);

    return new Response(
      JSON.stringify(
        {
          listings,
          count: listings.length,
        },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to fetch listings',
        listings: [],
        count: 0,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
