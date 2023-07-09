function memoize(fn) {
    return function(...args) {
        
    }
}

describe('memoize', () => {
    it('should be able to save', () => {
        let numTimesCalled = 0;
        const adder = function(a, b) {
            numTimesCalled++;
            return a + b;
        }

        const memoizedAdder = memoize(adder);
        expect(memoizedAdder(2, 3)).toBe(5);
        expect(numTimesCalled).toBe(1);
        expect(memoizedAdder(2, 3)).toBe(5);
        expect(numTimesCalled).toBe(1);
    });
});

/** 
 * let callCount = 0;
 * const memoizedFn = memoize(function (a, b) {
 *	 callCount += 1;
 *   return a + b;
 * })
 * memoizedFn(2, 3) // 5
 * memoizedFn(2, 3) // 5
 * console.log(callCount) // 1 
 */