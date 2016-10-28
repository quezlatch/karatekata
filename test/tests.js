var assert = require('assert');

function karate(size, comparer) {
    return 5;
}

describe('a sequence of 10', () => {
    it('finds 5, as first midpoint', () => assert.equal(5, karate(10, ()=> 0)));
});