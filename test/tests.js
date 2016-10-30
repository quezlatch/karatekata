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

function karateArray(searchItem, arr) {
    function comparer(idx, isEqual, isLower, isHigher) {
        var item = arr[idx];
        if (item > searchItem) return isLower;
        if (item < searchItem) return isHigher;
        return isEqual;
    }
    return karate(arr.length, comparer);
}

describe('the karate binary chop', () => {
    describe('a sequence of 10', () => {
        function makeComparer(i) {
            return function(idx, isEqual, isLower, isHigher) {
                if (i < idx) return isLower;
                if (i > idx) return isHigher;
                return isEqual;
            }
        }
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
    describe('random arrays of in order numbers', () => {
        function range(r) {
            return [...Array(r).keys()];
        }
        var rnd = bound => Math.floor(Math.random() * bound);
        function orderedRandomArray(size) {
            var arr = [size];
            var v = 0;
            for (var j = 0; j < size; j++) {
                v += rnd(100) + 1
                arr[j] = v;
            }
            return arr;
        }
        range(2).forEach(_ => {
            var size = rnd(500) + 10;
            var arr = orderedRandomArray(size);
            describe('array sized ' + size, () => {
                range(2).forEach( _ => {
                    var idx = rnd(size);
                    var v = arr[idx];
                    it('index of value ' + v + ' is at ' + idx, () => assert.equal(idx, karateArray(v, arr)));
                });
            });
        });
    });
});