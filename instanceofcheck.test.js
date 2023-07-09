const { checkIfInstanceOf } = require("./instanceofcheck");

describe("instance of check", () => {
  it("should be able to do by first class inheritance", () => {
    class AbstractThing {}

    class Animal extends AbstractThing {
      foo;
    }

    class Dog extends Animal {
      bar;
    }

    const animal = new Dog();
    expect(checkIfInstanceOf(animal, Dog)).toBeTruthy();
  });

  it("should be able to do by second class inheritance", () => {
    class AbstractThing {}

    class Animal extends AbstractThing {
      foo;
    }

    class Dog extends Animal {
      bar;
    }

    const animal = new Dog();
    expect(checkIfInstanceOf(animal, Animal)).toBeTruthy();
  });

  it("should be able to do Date", () => {
    expect(checkIfInstanceOf(new Date(), Date)).toBeTruthy();
  });

  it("should be able to do Number", () => {
    expect(checkIfInstanceOf(5, Number)).toBeTruthy();
  });

  it("should be able to do 5n object check", () => {
    expect(checkIfInstanceOf(5n, Object)).toBeTruthy();
  });

  it("we are testing out how function constructors work", () => {
    function A() {
      this.value = 5;
    }

    // How does the this keyword for this?
    A.prototype.foo = function () {
      this.value++;
    };

    function B() {
      this.value = 8;
    }

    function innerFunction() {
      function A() {
        this.value = 10;
      }

      A.prototype.foo = function() {
        this.value = this.value  + 2;
      }

      const meow = new A();
    }

    Object.setPrototypeOf(A.prototype, B.prototype);

    innerFunction();

    const testObject = new A();
    testObject.foo();
  });

  it("should do Object create null without issue", () => {
    function A() {}
    const testObject = Object.create(null);
    expect(checkIfInstanceOf(testObject, A)).toBeFalsy();
  });

  it("we are testing how the new style constructors work", () => {
    class A {
      value;

      constructor() {
        this.value = 5;
      }

      fooA() {
        this.value++;
      }
    }

    class B extends A {
      value;

      constructor() {
        super();
        this.value = 6;
      }

      fooB() {
        this.value++;
      }
    }

    const testObject = new B();
    expect(checkIfInstanceOf(testObject, A)).toBeTruthy();
    expect(checkIfInstanceOf(testObject, B)).toBeTruthy();
    expect(checkIfInstanceOf(testObject, Object)).toBeTruthy();
  });

  it("should be able to check against falsy obj", () => {
    expect(checkIfInstanceOf(null, Object)).toBeFalsy();
  });

  it("should be able to check against falsy type", () => {
    expect(checkIfInstanceOf({}, null)).toBeFalsy();
  });

  it("should check Number.NaN against Number", () => {
    expect(checkIfInstanceOf(Number.NaN, Number)).toBeTruthy();
  });
});
