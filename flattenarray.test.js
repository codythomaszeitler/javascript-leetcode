/**
 * @param {any[]} arr
 * @param {number} depth
 * @return {any[]}
 */
var flat = function (arr, n) {
    const output = [];
    flatten(arr, 0);
    return output;

    function flatten(array, cn) {
        array.forEach(element => {
            if (Array.isArray(element)) {
                if (n === cn) {
                    output.push(element);
                } else {
                    flatten(element, ++cn);
                }
            } else {
                output.push(element);
            }
        });
    }
};


describe('flatten array', () => {
    it('should be able to flatten an array', () => {
        const input = [1, 2, 3, [4, 5, [7, 8], 6], 10, 11];
        const output = flat(input, 1);

        expect(output).toEqual([1, 2, 3, 4, 5, [7, 8], 6, 10, 11]);
    });

    it('should do the 0 case', () => {
        const input = [1, 2, 3, [4, 5, [7, 8], 6], 10, 11];
        const output = flat(input, 0);

        expect(output).toEqual(input);
    });

    it('should do the 2 case', () => {
        const input = [1, 2, 3, [4, 5, [7, 8], 6], 10, 11];
        const output = flat(input, 2);

        expect(output).toEqual([1, 2, 3, 4, 5, 7, 8, 6, 10, 11]);
    });
});