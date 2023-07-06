var TimeLimitedCache = function () {
  this.cache = {};

  this.isExpired = (cacheItem) => {
    const current = Date.now();
    const start = cacheItem.start;
    const duration = cacheItem.duration;
    return current - start > duration;
  };
};

/**
 * @param {number} key
 * @param {number} value
 * @param {number} duration time until expiration in ms
 * @return {boolean} if un-expired key already existed
 */
TimeLimitedCache.prototype.set = function (key, value, duration) {
  const start = Date.now();

  const cacheItem = this.cache[key];
  this.cache[key] = {
    start,
    duration,
    value,
  };

  if(cacheItem && !this.isExpired(cacheItem)) {
    return true;
  } else {
    return false;
  }
};

/**
 * @param {number} key
 * @return {number} value associated with key
 */
TimeLimitedCache.prototype.get = function (key) {
  const cacheItem = this.cache[key];
  if (!cacheItem && this.isExpired(cacheItem)) {
    return -1;
  } else {
    return this.cache[key].value;
  }
};

/**
 * @return {number} count of non-expired keys
 */
TimeLimitedCache.prototype.count = function () {
  return Object.values(this.cache).filter((cacheItem) =>
    !this.isExpired(cacheItem)
  ).length;
};

/**
 * Your TimeLimitedCache object will be instantiated and called as such:
 * var obj = new TimeLimitedCache()
 * obj.set(1, 42, 1000); // false
 * obj.get(1) // 42
 * obj.count() // 1
 */

describe("time limited cache", () => {
  it("test 1", () => {
    const testObject = new TimeLimitedCache();
    expect(testObject.set(1, 42, 1000)).toBeNull();
    const value = testObject.get(1);

    expect(value).toBe(42);
    expect(testObject.count()).toBe(1);
  });

  it("test 2", (done) => {
    const testObject = new TimeLimitedCache();
    testObject.set(1, 42, 1000);
    expect(testObject.set(1, 42, 1000)).toBeTruthy();

    setTimeout(() => {
      const value = testObject.get(1);
      expect(value).toBe(-1);
      done();
    }, 1001);
  });
});
