import type { APIRoute } from 'astro';
import { fetchListings } from '../../utils/fetch-listings';

export const GET: APIRoute = async () => {
  try {
    const result = await fetchListings();
    
    return new Response(
      JSON.stringify(result, null, 2),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
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
