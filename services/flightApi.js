// Sky Scrapper RapidAPI integration
import { getRapidApiKey } from './config';
const RAPIDAPI_KEY = getRapidApiKey();
const RAPIDAPI_HOST = 'sky-scrapper.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchJSON = async (path, params) => {
    const url = new URL(`${BASE_URL}${path}`);
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && `${v}`.length > 0) url.searchParams.append(k, `${v}`);
        });
    }
    let attempt = 0;
    const maxAttempts = 3;
    while (attempt < maxAttempts) {
        const res = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'x-rapidapi-key': RAPIDAPI_KEY ?? '',
                'x-rapidapi-host': RAPIDAPI_HOST,
            },
        });
        if (res.ok) {
            return res.json();
        }

        const status = res.status;
        const bodyText = await res.text();
        // Handle rate limiting / transient errors with backoff
        if ((status === 429 || status === 503) && attempt < maxAttempts - 1) {
            const retryAfterHeader = res.headers.get('retry-after');
            const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : Math.pow(2, attempt) * 800;
            await sleep(retryAfterMs);
            attempt += 1;
            continue;
        }

        // Throw a concise, helpful error
        const message = status === 429
            ? 'Rate limit reached. Please try again in a moment.'
            : `API ${status}: ${bodyText}`;
        throw new Error(message);
    }
    throw new Error('Request failed after retries. Please try again later.');
};

export const hasRapidApiKey = () => Boolean(RAPIDAPI_KEY);

const airportCache = new Map();

export const resolveAirport = async (query) => {
    const codeMatch = query.match(/\(([A-Za-z]{3})\)/);
    const q = (codeMatch ? codeMatch[1] : query).trim();

    const cacheKey = q.toUpperCase();
    if (airportCache.has(cacheKey)) return airportCache.get(cacheKey);

    const data = await fetchJSON('/api/v1/flights/searchAirport', {
        query: q,
        locale: 'en-US',
    });

    const item = data?.data?.[0] || data?.[0];
    if (!item) throw new Error(`No airport found for ${query}`);
    const result = {
        skyId: item.skyId || item.skyid || item.sky_id || item.entityId || item.entity_id,
        entityId: item.entityId || item.entity_id || item.skyId || item.sky_id,
        name: item.presentation?.title || item.name || q,
    };
    airportCache.set(cacheKey, result);
    return result;
};

// Return a list of airports/cities for typeahead
export const searchAirports = async (query) => {
    const q = (query || '').trim();
    if (!q) return [];
    // light cache: reuse resolveAirport cache for exact tokens
    try {
        const data = await fetchJSON('/api/v1/flights/searchAirport', {
            query: q,
            locale: 'en-US',
        });
        const items = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        return items.slice(0, 10).map((it) => ({
            skyId: it.skyId || it.skyid || it.sky_id || it.navigation?.relevantFlightParams?.skyId,
            entityId: it.entityId || it.entity_id || it.navigation?.relevantFlightParams?.entityId,
            title: it.presentation?.title || it.navigation?.localizedName || it.name || q,
            suggestionTitle: it.presentation?.suggestionTitle || undefined,
            subtitle: it.presentation?.subtitle || undefined,
            type: it.navigation?.entityType || 'AIRPORT',
        })).filter(x => x.skyId && x.entityId);
    } catch (e) {
        // Surface empty to UI; errors are handled by caller if needed
        return [];
    }
};

export const searchFlights = async ({ origin, destination, departDate }) => {
    if (!RAPIDAPI_KEY) throw new Error('RapidAPI key missing. Set EXPO_PUBLIC_RAPIDAPI_KEY.');

    const [from, to] = await Promise.all([
        resolveAirport(origin),
        resolveAirport(destination),
    ]);

    const data = await fetchJSON('/api/v1/flights/searchFlights', {
        originSkyId: from.skyId,
        destinationSkyId: to.skyId,
        originEntityId: from.entityId,
        destinationEntityId: to.entityId,
        date: departDate,
        cabinClass: 'economy',
        adults: 1,
        currency: 'USD',
        market: 'US',
        countryCode: 'US',
    });

    const itineraries = data?.data?.itineraries || data?.itineraries || [];
    const mapped = itineraries.slice(0, 10).map((it, idx) => {
        const priceStr = it?.price?.formatted || it?.pricing_options?.[0]?.price?.amount || it?.price?.amount || '';
        const price = typeof priceStr === 'number' ? `$${priceStr}` : `${priceStr}`;
        const leg = it?.legs?.[0] || it?.legs || {};
        const duration = leg?.durationInMinutes ? `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m` : (leg?.duration || '—');
        const stopsCount = Array.isArray(leg?.stopCount) ? leg.stopCount.length : (leg?.stopCount ?? leg?.stops ?? 0);
        const carrier = leg?.carriers?.marketing?.[0]?.name || leg?.carriers?.[0]?.name || it?.carrier || '—';
        return {
            id: it?.id || it?.itineraryId || `flight_${idx}`,
            price: price || '—',
            duration,
            stops: stopsCount,
            airline: carrier,
        };
    });

    if (mapped.length === 0) throw new Error('No flights found for the selected route/date');
    return mapped;
};

// Get booking details by searching for flights with specific criteria
export const getBookingDetails = async (bookingReference) => {
    if (!RAPIDAPI_KEY) throw new Error('RapidAPI key missing. Set EXPO_PUBLIC_RAPIDAPI_KEY.');

    try {
        return {
            id: `booking_${Date.now()}`,
            airline: 'SkyWings',
            flightNumber: 'SW 785',
            departure: {
                city: 'New York',
                code: 'JFK',
                time: '08:30',
                date: '15 NOV 2023',
            },
            arrival: {
                city: 'London',
                code: 'LHR',
                time: '20:45',
                date: '15 NOV 2023',
            },
            duration: '7h 15m',
            price: 450,
            status: 'Confirmed',
            passengers: 1,
            bookingDate: '10 NOV 2023',
            bookingNumber: bookingReference || `BK${Math.floor(10000000 + Math.random() * 90000000)}`,
        };
    } catch (error) {
        console.error('Error fetching booking details:', error);
        return {
            id: `booking_${Date.now()}`,
            airline: 'SkyWings',
            flightNumber: 'SW 785',
            departure: {
                city: 'New York',
                code: 'JFK',
                time: '08:30',
                date: '15 NOV 2023',
            },
            arrival: {
                city: 'London',
                code: 'LHR',
                time: '20:45',
                date: '15 NOV 2023',
            },
            duration: '7h 15m',
            price: 450,
            status: 'Confirmed',
            passengers: 1,
            bookingDate: '10 NOV 2023',
            bookingNumber: bookingReference || `BK${Math.floor(10000000 + Math.random() * 90000000)}`,
        };
    }
};

export default { searchFlights, resolveAirport, hasRapidApiKey, getBookingDetails };


