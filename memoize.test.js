function TrieNode({ key, length }) {
  this.nodes = [];
  this.key = key;
  this.length = length;
}

TrieNode.prototype.get = function (key) {
  return this.nodes.find((node) => node.key === stringify(key));
};

function Trie() {
  this.nodes = [];
}

function doesTrieHave(node, args) {
  return (
    Object.hasOwn(node, "key") &&
    node.key === stringify(args[0]) &&
    args.length === node.length
  );
}

let id = 0;
function stringify(key) {
  if (isObject(key)) {
    if (!key.__uniqueId) {
      Object.defineProperty(key, "__uniqueId", {
        value : id++,
        enumerable : false
      });
    }
    return "__uniqueId " + key.__uniqueId;
  } else {
    return key === undefined || key === null ? key : JSON.stringify(key);
  }
}

function isObject(toCheck) {
  return (
    typeof toCheck === "object" && !Array.isArray(toCheck) && toCheck !== null
  );
}

Trie.prototype.get = function (args) {
  let node = this.nodes.find((node) => doesTrieHave(node, args));
  if (!node) {
    return undefined;
  }

  for (let i = 1; i < args.length; i++) {
    node = node.get(args[i]);
    if (!node) {
      return undefined;
    }
  }
  return node.value;
};

Trie.prototype.has = function (args) {
  let node = this.nodes.find((node) => doesTrieHave(node, args));
  if (!node) {
    return false;
  }

  for (let i = 1; i < args.length; i++) {
    node = node.get(args[i]);
    if (!node) {
      return false;
    }
  }
  return Object.hasOwn(node, "value");
};

Trie.prototype.put = function (args, result) {
  let prev = this.nodes.find((node) => doesTrieHave(node, args));
  if (!prev) {
    prev = new TrieNode({ key: stringify(args[0]), length: args.length });
    this.nodes.push(prev);
  }

  if (args.length === 0 || args.length === 1) {
    prev.value = result;
  }

  for (let i = 1; i < args.length; i++) {
    let node = prev.get(args[i]);
    if (!node) {
      node = new TrieNode({ key: stringify(args[i]) });
    }

    if (i === args.length - 1) {
      node.value = result;
    }
    prev.nodes.push(node);
    prev = node;
  }
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
