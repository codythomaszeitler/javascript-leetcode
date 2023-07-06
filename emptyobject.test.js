/**
 * @param {Object | Array} obj
 * @return {boolean}
 */
var isEmpty = function(obj) {
    if (obj === null || obj === undefined) {
        return true;
    }

    if (Array.isArray(obj)) {
        return !obj.length;
    } else {
        return !Object.keys(obj).length;
    }
};

describe('is empty', () => {
    it("test 1", () => {
        const object = {
            x : 5,
            y : 42
        }

        expect(isEmpty(object)).toBeFalsy();
    });

    it("test 2", () => {
        const object = {};
        expect(isEmpty(object)).toBeTruthy();
    });

    it("test 3", () => {
        const object = [null, false, 0];
        expect(isEmpty(object)).toBeFalsy();
    });

    it("test 4", () => {
        const object = [];
        expect(isEmpty(object)).toBeTruthy();
    })

    it("test 5", () => {
        const object = Array(5);
        expect(isEmpty(object)).toBeFalsy();
    });

    it("test 6", () => {
        const object = null;
        expect(isEmpty(object)).toBeTruthy();
    });
});