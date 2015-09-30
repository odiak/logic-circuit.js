import assert from 'power-assert';
import {HIGH, LOW, UNKNOWN, And, Or, Not, Nand} from '../index.js';

describe('And', () => {
  it('should be low when all inputs are not high', () => {
    let and = new And(3);
    and.inputPinAt(0).setValue(HIGH);
    assert(and.outputPinAt(0).value === LOW);
  });

  it('should be high when all inputs are high', () => {
    let and = new And(3);
    and.inputPinAt(0).setValue(HIGH);
    and.inputPinAt(1).setValue(HIGH);
    and.inputPinAt(2).setValue(HIGH);
    assert(and.outputPinAt(0).value === HIGH);
  });
});

describe('Not', () => {
  it('should be low input is high', () => {
    let not = new Not;
    not.inputPinAt(0).setValue(HIGH);
    assert(not.outputPinAt(0).value === LOW);
  });

  it('should be high input is low', () => {
    let not = new Not;
    not.inputPinAt(0).setValue(LOW);
    assert(not.outputPinAt(0).value === HIGH);
  });
});
