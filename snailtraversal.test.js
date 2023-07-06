/**
 * @param {number} rowsCount
 * @param {number} colsCount
 * @return {Array<Array<number>>}
 */
Array.prototype.snail = function (rowsCount, colsCount) {
    if (rowsCount * colsCount !== this.length) {
        return [];
    }

    const output = [];
    for (let i = 0; i < rowsCount; i++) {
        output.push([]);
    }

    let ri = 0;
    let isAscending = true;
    for (let i = 0; i < this.length; i++) {
        output[ri].push(this[i]);

        if (ri === (rowsCount - 1) && isAscending) {
            isAscending = false;
        } else if (ri === 0 && !isAscending) {
            isAscending = true;
        } else if (isAscending) {
            ri++;
        } else {
            ri--;
        }
    }

    return output;
};

describe("snail traversal", () => {
  it("test 1", () => {
    const nums = [
      19, 10, 3, 7, 9, 8, 5, 2, 1, 17, 16, 14, 12, 18, 6, 13, 11, 20, 4, 15,
    ];
    const rowsCount = 5;
    const colsCount = 4;

    const expected = [
      [19, 17, 16, 15],
      [10, 1, 14, 4],
      [3, 2, 12, 20],
      [7, 5, 18, 11],
      [9, 8, 6, 13],
    ];

    const output = nums.snail(rowsCount, colsCount);
    console.log(output);

    expect(expected).toEqual(output);

  });

  it("test 2", () => {
    const nums = [1, 2, 3, 4];

    const output = nums.snail(1, 4);
    const expected = [[1, 2, 3, 4]];
    expect(expected).toEqual(output);
  });

  it("should do error case", () => {
    const nums = [1,3]
    const rowsCount = 2
    const colsCount = 2

    const output = nums.snail(rowsCount, colsCount);
    expect([]).toEqual(output);
  });
});
