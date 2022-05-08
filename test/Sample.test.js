const assert = require('assert');
const { describe } = require('mocha');

class Car {
  park() {
    return 'stopped';
  }

  drive() {
    return 'vroom';
  }
}

let car;
beforeEach(() => {
  car = new Car();
});

describe('Sample Testing', () => {
  describe('- Car', () => {
    it('can park', () => {
      assert.equal(car.park(), 'stopped');
    });

    it('can drive', () => {
      assert.equal(car.drive(), 'vroom');
    })
  })
})