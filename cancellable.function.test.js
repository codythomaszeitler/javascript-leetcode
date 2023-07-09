/**
 * @param {Generator} generator
 * @return {[Function, Promise]}
 */
var cancellable = function (generator) {
  let cancelled = false;
  function cancel() {
    cancelled = true;
  }

  const promise = new Promise((resolve, reject) => {
    let element = generator.next();
    function run() {
      if (element.done) {
        resolve(element.value);
        return;
      }

      element.value
        .then((result) => {
          if (cancelled) {
            element = generator.throw("Cancelled");
          } else {
            element = generator.next(result);
          }
          run();
        })
        .catch((e) => {
          try {
            element = generator.throw(e);
            run();
          } catch (e) {
            reject(e);
            return;
          }
        });
    }
    run();
  });

  return [cancel, promise];
};

describe("cancellable function", () => {
  it("test 1", (done) => {
    //Input:
    const generatorFunction = function* () {
      return 42;
    };

    const [cancel, promise] = cancellable(generatorFunction());

    setTimeout(async () => {
      cancel();
      const result = await promise;
      expect(result).toBe(42);
      done();
    }, 100);
  });

  it("test 2", async () => {
    const generatorFunction = function* () {
      const msg = yield new Promise((res) => res("Hello"));
      throw `Error: ${msg}`;
    };

    const [cancel, promise] = cancellable(generatorFunction());

    try {
      await promise;
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it("test 3", async () => {
    // Input:
    const generatorFunction = function* () {
      yield new Promise((res) => setTimeout(res, 200));
      return "Success";
    };
    const [cancel, promise] = cancellable(generatorFunction());

    setTimeout(cancel, 100);

    let caughtException = null;
    try {
      await promise;
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException).toBe("Cancelled");
  });

  it("should cancel at the right point", async () => {
    function* generatorFunction() {
      let result = 0;
      yield new Promise((res) =>
        setTimeout(() => {
          res();
        }, 100)
      );
      let intermediateResult = yield new Promise((res) => res(1));
      result += intermediateResult;
      yield new Promise((res) => setTimeout(res, 100));
      result += yield new Promise((res) => res(1));
      return result;
    }

    const [cancel, promise] = cancellable(generatorFunction());
    const result = await promise;
    expect(result).toBe(2);
  });

  it("should do the thing", async () => {
    const generatorFunction = function* () {
      let result = 0;
      try {
        yield new Promise((res) => setTimeout(res, 100));
        result += yield new Promise((res) => res(1));
        yield new Promise((res) => setTimeout(res, 100));
        result += yield new Promise((res) => res(1));
      } catch (e) {
        return result;
      }
      return result;
    };

    const [cancel, promise] = cancellable(generatorFunction());

    setTimeout(cancel, 150);
    
    const result = await promise;
    expect(result).toBe(1);
  });

  it("should do test 6", async () => {
    const generatorFunction = function* () {
      try {
        yield new Promise((resolve, reject) => reject("Promise Rejected"));
      } catch (e) {
        let a = yield new Promise((resolve) => resolve(2));
        let b = yield new Promise((resolve) => resolve(2));
        return a + b;
      }
    };

    const [cancel, promise] = cancellable(generatorFunction());
    const result = await promise;
    expect(result).toBe(4);
  });

  it("should do test 7", async () => {
    const generatorFunction = function* () {
      try {
        yield new Promise((resolve, reject) => reject("Promise Rejected"));
      } catch (e) {
        let a = yield new Promise((resolve) => resolve(2));
        let b = yield new Promise((resolve) => resolve(2));
        yield new Promise((resolve, reject) => reject("Promise Rejected"));
        return a + b;
      }
    };

    const [cancel, promise] = cancellable(generatorFunction());
    let caughtException = null;
    try {
      await promise;
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException).toBe("Promise Rejected");
  });

  it("should do test 8", async () => {
    const generatorFunction = function* () {
      yield new Promise((resolve, reject) => reject("Promise Rejected"));
    };

    const [cancel, promise] = cancellable(generatorFunction());
    let caughtException = null;
    try {
      await promise;
    } catch (e) {
      caughtException = e;
    }

    expect(caughtException).toBe("Promise Rejected");
  });
});
