// Reverse geocoding using OpenStreetMap Nominatim (free, no API key)
// Converts lat/lng coordinates to a human-readable location name.

const cache = new Map();

/**
 * Get a human-readable location name from coordinates.
 * Uses OpenStreetMap Nominatim API (free, no key required).
 * 
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} - Location name (e.g. "Raipur, Chhattisgarh")
 */
export async function getLocationName(lat, lng) {
  if (!lat || !lng) return "";

  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;

  // Return from cache if available
  if (cache.has(key)) return cache.get(key);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );

    if (!res.ok) throw new Error("Geocoding failed");

    const data = await res.json();
    const addr = data.address || {};

    // Build a short, readable location string
    // Priority: village/town > city > county > state
    const parts = [];
    const place =
      addr.village ||
      addr.town ||
      addr.city ||
      addr.suburb ||
      addr.neighbourhood ||
      addr.hamlet ||
      "";
    if (place) parts.push(place);

    const district = addr.county || addr.state_district || "";
    if (district && district !== place) parts.push(district);

    const state = addr.state || "";
    if (state && state !== district) parts.push(state);

    const result = parts.length > 0 ? parts.join(", ") : data.display_name?.split(",").slice(0, 3).join(",") || "";

    cache.set(key, result);
    return result;
  } catch (err) {
    console.warn("Reverse geocoding failed:", err.message);
    cache.set(key, "");
    return "";
  }
}
