var assert = require('assert');

var notFound = -1;

function karate(size, comparer) {
    function outOfBounds(lower, upper) {
        return (lower === size - 1 || upper === 0);
    }
    function chop(lower, upper) {
        var midpoint = lower - Math.ceil((lower - upper)/2);
        return outOfBounds(lower, upper)
            ? notFound
            : comparer(midpoint, 
                () => midpoint, 
                () => chop(lower, midpoint), 
                () => chop(midpoint, upper))();
    }
    return chop(0, size);
}

function karateArray(searchItem, orderedArray) {
    function comparer(idx, isEqual, isLower, isHigher) {
        var item = orderedArray[idx];
        if (searchItem < item ) return isLower;
        if (searchItem > item ) return isHigher;
        return isEqual;
    }
    return karate(orderedArray.length, comparer);
}

describe('the karate binary chop', () => {
    var range = r => [...Array(r).keys()];
    var rnd = bound => Math.floor(Math.random() * bound);
    function makeComparer(searchItem) {
        return function(idx, isEqual, isLower, isHigher) {
            if (searchItem < idx) return isLower;
            if (searchItem > idx) return isHigher;
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
    describe('sequence of random size', () => {
        function orderedRandomArray(size) {
            var arr = [size];
            var v = 0;
            for (var j = 0; j < size; j++) {
                v += rnd(100) + 1
                arr[j] = v;
            }
            return arr;
        }
        range(10).forEach(_ => {
            var size = rnd(500) + 10;
            var orderedArray = orderedRandomArray(size);
            describe('array sized ' + size, () => {
                range(100).forEach( _ => {
                    var idx = rnd(size);
                    var item = orderedArray[idx];
                    it('index of item ' + item + ' is at ' + idx, () => assert.equal(idx, karateArray(item, orderedArray)));
                });
            });
        });
    });
});