
/**
 * @param {any} obj
 * @param {any} classFunction
 * @return {boolean}
 */
module.exports.checkIfInstanceOf = function(obj, classFunction) {
    if (obj === null || obj === undefined) {
        return false;
    }

    let iterator = Object.getPrototypeOf(obj);
    while (iterator !== null) {
        if (iterator.constructor === classFunction) {
            return true;
        }

        iterator = Object.getPrototypeOf(iterator);
    }

    return false;
};
