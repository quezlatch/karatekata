var assert = require('assert');

var notFound = -1;

function karate(size, comparer) {
    var goLower = (lower, upper) => lower - Math.ceil((upper - lower)/2);
    var goHigher = (lower, upper) => lower + Math.floor((upper - lower)/2);
    function chop(lower, upper, getMidpoint){
        var midpoint = getMidpoint(lower, upper);
        return (midpoint == lower) 
            ? notFound
            : comparer(midpoint, 
                () => midpoint, 
                () => chop(lower, midpoint, goLower), 
                () => chop(midpoint, upper, goHigher))();
    }
    return chop(0, size, goHigher);
}

describe('a sequence of 10', () => {
    function makeComparer(i) {
        return function(item, isEqual, isLower, isHigher) {
            if (item > i) return isLower;
            if (item < i) return isHigher;
            return isEqual;
        }
    }
    describe('a sequence of 10', () => {
        describe('for every number in the sequence', () => {
            for (var i = 0; i < 10; i++) {
                var item = i;
                it('finds number ' + i, () => assert.equal(item, karate(10, makeComparer(item))));
            }
        });
        describe('cannot find', () => {
            it('a number after the sequence', () => assert.equal(notFound, karate(10, (_, __, ___, isHigher) => isHigher)));
            it('a number before the sequence', () => assert.equal(notFound, karate(10, (_, __, isLower, ___) => isLower)));
        });
    });
});