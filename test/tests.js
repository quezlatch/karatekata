var assert = require('assert');

var isEqual = 0;
var isLower = 1;
var isHigher = 2;
var notFound = -1;

function karate(size, comparer) {
    function goLower(lower, upper){
        var midpoint = lower - Math.ceil((upper - lower)/2);
        if (midpoint == lower) return notFound;
        var c = comparer(midpoint)
        if (c === isHigher) return goHigher(midpoint, upper);
        if (c === isLower) return goLower(lower, midpoint);
        return midpoint
    }
    function goHigher(lower, upper){
        var midpoint = lower + Math.floor((upper - lower)/2);
        if (midpoint == lower) return notFound;
        var c = comparer(midpoint)
        if (c === isHigher) return goHigher(midpoint, upper);
        if (c === isLower) return goLower(lower, midpoint);
        return midpoint
    }
    return goHigher(0, size);
}

describe('a sequence of 10', () => {
    function makeComparer(i){
        return function(s) {
            if (s > i)
                return isLower;
            if (s < i)
                return isHigher;
            return isEqual;
        }
    }
    var assertFindsNumberInSequence = i => assert.equal(i, karate(10, makeComparer(i)));
    describe('a sequence of 10', () => {
        describe('going up', () => {
            it('finds 5, as first midpoint', () => assertFindsNumberInSequence(5));
            it('finds 7, as 2nd midpoint', () => assertFindsNumberInSequence(7));
            it('finds 8, as 3rd midpoint', () => assertFindsNumberInSequence(8));
            it('finds 9, as 4th midpoint', () => assertFindsNumberInSequence(9));
            it('has not found, as goes out of bounds', () => assert.equal(notFound, karate(10, () => isHigher)));
        });
        describe('going down', () => {
            it('finds 3, as 2nd midpoint', () => assertFindsNumberInSequence(3));
            it('finds 2, as 2nd midpoint', () => assertFindsNumberInSequence(3));
            it('finds 1, as 2nd midpoint', () => assertFindsNumberInSequence(3));
            it('finds 0, as 2nd midpoint', () => assertFindsNumberInSequence(3));
            it('has not found, as goes out of bounds', () => assert.equal(notFound, karate(10, () => isLower)));
        });
    });
});