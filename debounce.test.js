/**
 * @param {Function} fn
 * @param {number} t milliseconds
 * @return {Function}
 */
var debounce = function (fn, t) {
  let lastArgs = undefined;
  let finished = false;
  setTimeout(() => {
    fn(...lastArgs);
    finished = true;
  }, t);

  return function (...args) {
    if (!finished) {
      lastArgs = args;
    } else {
      fn(...args);
    }
  };
};

describe("debounce", () => {
  it("test 1", () => {
    const log = debounce(console.log, 100);
    log("Hello"); // cancelled
    log("Hello"); // cancelled
    log("Hello"); // Logged at t=100ms
  });

  it("test 2", () => {
    let start = Date.now();
    function log(...inputs) {
      console.log([Date.now() - start, inputs]);
    }
    const dlog = debounce(log, 50);
    setTimeout(() => dlog(1), 50);
    setTimeout(() => dlog(2), 75);
  });
});

/**
 * const log = debounce(console.log, 100);
 * log('Hello'); // cancelled
 * log('Hello'); // cancelled
 * log('Hello'); // Logged at t=100ms
 */
