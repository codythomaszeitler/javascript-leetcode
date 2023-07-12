/**
 * @param {Function} fn
 * @return {Array}
 */
Array.prototype.groupBy = function (fn) {
  const grouped = {};
  this.forEach((element) => {
    const key = fn(element);
    if (!Object.hasOwn(grouped, key)) {
      grouped[key] = [];
    }
    grouped[key].push(element);
  });
  return grouped;
};

/**
 * [1,2,3].groupBy(String) // {"1":[1],"2":[2],"3":[3]}
 */

describe("group by", () => {
  it("test 1", () => {
    const array = [{ id: "1" }, { id: "1" }, { id: "2" }];
    function fn(item) {
      return item.id;
    }

    const output = array.groupBy(fn);
    console.log(output);
  });
});
