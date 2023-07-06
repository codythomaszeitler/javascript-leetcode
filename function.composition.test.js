var compose = function(functions) {
	return function(x) {
        return functions.reduceRight((cv, func) => {
            return func(cv);
        }, x);
    }
};

describe('compose function', () => {
    // Input: functions = [x => x + 1, x => x * x, x => 2 * x], x = 4
    // Output: 65
    // Explanation:
    // Evaluating from right to left ...
    // Starting with x = 4.
    // 2 * (4) = 8
    // (8) * (8) = 64
    // (64) + 1 = 65
    it('test 1', () => {
        const functions = [x => x + 1, x => x * x, x => 2 * x];
        const x = 4;

        const composed = compose(functions);
        expect(composed(x)).toBe(65);
    });
});