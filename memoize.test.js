
function Trie() {
  this.nodes = new Map();
}

Trie.prototype.get = function (args) {
  let prev = this;
  for (let i = 0; i < args.length; i++) {
    prev = prev.nodes.get(args[i]);
  }
  return prev.value;
};

Trie.prototype.has = function (args) {
  let prev = this;
  for (let i = 0; i < args.length; i++) {
    prev = prev.nodes.get(args[i]);
    if (prev === undefined) {
      return false;
    }
  }
  return Object.hasOwn(prev, "value"); 
};

Trie.prototype.put = function (args, result) {
  let prev = this;
  for (let i = 0; i < args.length; i++) {
    let node = prev.nodes.get(args[i]);
    if (node === undefined) {
      node = new Trie();
      prev.nodes.set(args[i], node);
    }
    prev = node;
  }
  prev.value = result;
};

function memoize(fn) {
  const trie = new Trie();

  return function (...args) {
    if (trie.has(args)) {
      return trie.get(args);
    }

    const result = fn(...args);
    trie.put(args, result);
    return result;
  };
}

describe("memoize", () => {
  it("should be able to save", () => {
    let numTimesCalled = 0;
    const adder = function (a, b) {
      numTimesCalled++;
      return a + b;
    };

    const memoizedAdder = memoize(adder);
    expect(memoizedAdder(2, 3)).toBe(5);
    expect(numTimesCalled).toBe(1);
    expect(memoizedAdder(2, 3)).toBe(5);
    expect(numTimesCalled).toBe(1);
  });

  it("test 1", () => {
    const foo = function (a, b) {
      return a() + b();
    };

    const a = () => {
      return 2;
    };

    const b = () => {
      return 3;
    };

    const memoizeFoo = memoize(foo);
    expect(memoizeFoo(a, b)).toBe(5);
    expect(memoizeFoo(a, b)).toBe(5);
  });

  it("test 2", () => {
    const foo = function (a, b) {
      return a.value + b.value;
    };

    const a = { value: 5 };

    const b = { value: 7 };

    const memoizeFoo = memoize(foo);
    expect(memoizeFoo(a, b)).toBe(12);
    expect(memoizeFoo(a, b)).toBe(12);
  });

  it("test 3", () => {
    const foo = function (a) {
      return !!a;
    };

    const memoizeFoo = memoize(foo);
    expect(memoizeFoo(null)).toEqual(foo(null));
    expect(memoizeFoo(null)).toEqual(foo(null));

    expect(memoizeFoo(undefined)).toEqual(foo(undefined));
    expect(memoizeFoo(undefined)).toEqual(foo(undefined));
  });

  it("test 4", () => {
    // () => [[1,1,1],[1,1],[1],[1,1],[1,1,1]]
    const foo = function (...arr) {
      return arr.reduce((a, b) => a + b, 0);
    };

    const memoizeFoo = memoize(foo);

    expect(memoizeFoo(1, 1, 1)).toEqual(foo(1, 1, 1));
    expect(memoizeFoo(1, 1)).toEqual(foo(1, 1));
    expect(memoizeFoo(1)).toEqual(foo(1));

    expect(memoizeFoo(1, 1, 1)).toEqual(foo(1, 1, 1));
    expect(memoizeFoo(1, 1)).toEqual(foo(1, 1));
    expect(memoizeFoo(1)).toEqual(foo(1));
  });

  it("test 5", () => {
    // () => [[],[1],[1],[],[1,2],[1,2]]
    const foo = function (...arr) {
      return arr.reduce((a, b) => a + b, 0);
    };
    const memoizeFoo = memoize(foo);

    expect(memoizeFoo()).toEqual(foo());
    expect(memoizeFoo()).toEqual(foo());

    expect(memoizeFoo(1)).toEqual(foo(1));
    expect(memoizeFoo(1)).toEqual(foo(1));
  });

  it("test 6", () => {
    const foo = function (...arr) {
      return arr.findIndex(Boolean);
    };
    const memoizeFoo = memoize(foo);

    expect(memoizeFoo()).toEqual(foo());
    expect(memoizeFoo(undefined)).toEqual(foo(undefined));

    expect(memoizeFoo()).toEqual(foo());
    expect(memoizeFoo(undefined)).toEqual(foo(undefined));
  });

  it("test 7", () => {
    const foo = function (a, b) {
      return { ...a, ...b };
    };
    const memoizeFoo = memoize(foo);

    const o = {};
    const b = {};

    expect(memoizeFoo(o, b)).toEqual(foo(o, b));
    expect(memoizeFoo(o, b)).toEqual(foo(o, b));

    expect(memoizeFoo(o, {})).toEqual(foo(o, {}));
    expect(memoizeFoo(o, {})).toEqual(foo(o, {}));
  });

  it('map characteristics', () => {
    const map = new Map();
    map.set(null, "cody");
    map.set(undefined, "kirk");
    map.set(NaN, "kyle");
    map.set('', "roger");
    map.set(0, "cat");
    map.set(false, "dog");

    const a = {};
    const b = {};

    map.set(a, "a");
    map.set(b, "b");

    const emptyObjectValue = map.get({});
    const aValue = map.get(a);
    const bValue = map.get(b);

    const nullValue = map.get(null);
    console.log(nullValue);

    const undefinedValue = map.get(undefined);
    console.log(undefinedValue);

    const NaNValue = map.get(NaN);
    console.log(NaNValue);

    const emptyStringValue = map.get('');
    console.log(emptyStringValue);
  })
});
