var assert = require('assert');

var isEqual = 0;
var isLower = 1;
var isHigher = 2;

function karate(size, comparer) {
    function goHigher(current, last){
        var midpoint = current + Math.floor((last - current)/2);
        var c = comparer(midpoint)
        if (c === isHigher) return goHigher(midpoint, last);
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
    it('finds 5, as first midpoint', () => assertFindsNumberInSequence(5));
    it('finds 7, as 2nd midpoint', () => assertFindsNumberInSequence(7));
});