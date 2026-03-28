/**
 * Simple in-memory cache with TTL
 */
class Cache {
  constructor(ttl = 60000) { // Default TTL: 1 minute
    this.cache = new Map();
    this.ttl = ttl;
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {any} Cached value or undefined if not found/expired
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return undefined;
    
    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value;
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} [customTtl] - Optional custom TTL
   */
  set(key, value, customTtl) {
    const ttl = customTtl || this.ttl;
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Remove item from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache size
   * @returns {number} Number of items in cache
   */
  size() {
    return this.cache.size;
  }
}

// Create specific cache instances
const productCache = new Cache(300000); // 5 minutes
const featuredProductCache = new Cache(600000); // 10 minutes
const categoryCache = new Cache(900000); // 15 minutes
const announcementCache = new Cache(300000); // 5 minutes

// Export the Cache class as default and instances as named exports
export { productCache, featuredProductCache, categoryCache, announcementCache };
export default Cache;