var assert = require('assert');

var isEqual = 0;
var isLower = 1;
var isHigher = 2;
var notFound = -1;

function karate(size, comparer) {
    var goLower = (lower, upper) => lower - Math.ceil((upper - lower)/2);
    var goHigher = (lower, upper) => lower + Math.floor((upper - lower)/2);
    function chop(lower, upper, getMidpoint){
        var midpoint = getMidpoint(lower, upper);
        if (midpoint == lower) return notFound;
        var c = comparer(midpoint)
        if (c === isHigher) return chop(midpoint, upper, goHigher);
        if (c === isLower) return chop(lower, midpoint, goLower);
        return midpoint
    }
    return chop(0, size, goHigher);
}

describe('a sequence of 10', () => {
    function makeComparer(i) {
        return function(s) {
            if (s > i) return isLower;
            if (s < i) return isHigher;
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
            it('a number after the sequence', () => assert.equal(notFound, karate(10, () => isHigher)));
            it('a number before the sequence', () => assert.equal(notFound, karate(10, () => isLower)));
        });
    });
});