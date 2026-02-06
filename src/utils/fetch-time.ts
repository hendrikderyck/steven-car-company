const TIME_URL = 'https://www.timeanddate.com/worldclock/belgium/leuven';

const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

export interface TimeData {
  time: string;
  date: string;
  timezone: string;
  timestamp: string;
  fetchedAt: string;
}

/**
 * Fetches the current time from timeanddate.com and parses it
 */
export async function fetchTime(): Promise<TimeData> {
  try {
    console.log('[fetchTime] Fetching from:', TIME_URL);
    const response = await fetch(TIME_URL, {
      headers: FETCH_HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch time: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    console.log('[fetchTime] HTML length:', html.length);
    
    let time = '';
    let date = '';
    let timezone = 'CET';
    
    // Strategy 1: Look for the main time display pattern
    // Pattern from actual HTML: "8:06:59 pm" followed by "[CET]" link
    // Try multiple patterns to catch variations
    const timePatterns = [
      /(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)\s*(?:\[(CET|CEST|UTC)\])?/i,
      /(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)\s*(?:\[(CET|CEST|UTC)\])?/i,
      /(\d{1,2}):(\d{2}):(\d{2})\s*(am|pm)/i,
      /(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)/i,
    ];
    
    for (const pattern of timePatterns) {
      const match = html.match(pattern);
      if (match) {
        const [, hour, minute, second, ampm, tz] = match;
        time = `${hour}:${minute}:${second} ${ampm.toUpperCase()}`;
        if (tz) {
          timezone = tz;
        }
        console.log('[fetchTime] Found time:', time, 'timezone:', timezone);
        break;
      }
    }
    
    if (!time) {
      console.warn('[fetchTime] Could not parse time from HTML');
    }
    
    // Strategy 2: Parse date - looking for patterns like "Saturday, December 27, 2025"
    const datePatterns = [
      /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s*(\d{4})/i,
      /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s*(\d{4})/i,
    ];
    
    for (const pattern of datePatterns) {
      const match = html.match(pattern);
      if (match) {
        const [, day, month, dayNum, year] = match;
        date = `${day}, ${month} ${dayNum}, ${year}`;
        console.log('[fetchTime] Found date:', date);
        break;
      }
    }
    
    if (!date) {
      console.warn('[fetchTime] Could not parse date from HTML');
    }
    
    // Strategy 3: Parse timezone from various locations
    // Look for timezone link or text
    if (!timezone || timezone === 'CET') {
      // Check for timezone in link format [CET] or (CET)
      const tzLinkMatch = html.match(/\[(CET|CEST|UTC)\]/i);
      if (tzLinkMatch) {
        timezone = tzLinkMatch[1];
      } else if (html.includes('CET (Central European Time)')) {
        timezone = 'CET';
      } else if (html.includes('CEST (Central European Summer Time)')) {
        timezone = 'CEST';
      } else {
        const tzMatch = html.match(/(CET|CEST|UTC)\s*\([^)]+\)/i);
        if (tzMatch) {
          timezone = tzMatch[1];
        }
      }
    }
    
    // Create ISO timestamp
    const now = new Date();
    const timestamp = now.toISOString();
    const fetchedAt = now.toISOString();
    
    // If we have date and time, try to construct a more accurate timestamp
    if (date && time) {
      try {
        // Parse the date string to create a Date object
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          // Extract hour, minute, second from time string
          const timeParts = time.match(/(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)/i);
          if (timeParts) {
            let hour = parseInt(timeParts[1], 10);
            const minute = parseInt(timeParts[2], 10);
            const second = parseInt(timeParts[3], 10);
            const ampm = timeParts[4].toUpperCase();
            
            if (ampm === 'PM' && hour !== 12) {
              hour += 12;
            } else if (ampm === 'AM' && hour === 12) {
              hour = 0;
            }
            
            dateObj.setHours(hour, minute, second, 0);
            const constructedTimestamp = dateObj.toISOString();
            if (!isNaN(dateObj.getTime())) {
              return {
                time,
                date,
                timezone,
                timestamp: constructedTimestamp,
                fetchedAt,
              };
            }
          }
        }
      } catch (e) {
        // Fall through to use current timestamp
      }
    }
    
    return {
      time: time || 'Unable to parse',
      date: date || 'Unable to parse',
      timezone,
      timestamp,
      fetchedAt,
    };
  } catch (error) {
    console.error('[fetchTime] Error fetching time:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const now = new Date();
    return {
      time: `Error: ${errorMessage}`,
      date: `Error: ${errorMessage}`,
      timezone: 'CET',
      timestamp: now.toISOString(),
      fetchedAt: now.toISOString(),
    };
  }
}
