describe("array last", () => {
  beforeEach(() => {
    Array.prototype.last = function () {
        if (this.length === 0) {
            return -1;
        }

        return this[this.length - 1];
    };
  });

  it("should be able to add to array prototype", () => {
    const nums = [null, {}, 3];
    expect(nums.last()).toBe(3);
  });

  it("should return -1 when there are no elements", () => {
    const nums = [];
    expect(nums.last()).toBe(-1);
  });
});
