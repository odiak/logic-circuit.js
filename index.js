export const UNKNOWN = -1;
export const HIGH = 1;
export const LOW = 0;


function repeat (n, callback, thisArg) {
  let terminated = false;
  function terminate () { terminated = true; }

  for (let i = 0; !terminated && i < n; i++) {
    callback.call(thisArg, i, terminate);
  }
}

function logicalAnd (a, b) {
  if (a === HIGH && b === HIGH) return HIGH;
  return LOW;
}

function logicalOr (a, b) {
  if (a === HIGH || b === HIGH) return HIGH;
  return LOW;
}

function logicalNot (a) {
  if (a === HIGH) return LOW;
  if (a === LOW) return HIGH;
  return UNKNOWN;
}


export class Pin {
  constructor (initialValue) {
    this.value = initialValue != null ? initialValue : UNKNOWN;
    this.destinationPins = [];
    this.sourcePin = null;
    this.changeListeners = [];
  }

  setValue (value) {
    if (this.value === value) return;

    this.value = value;
    this.destinationPins.forEach((pin) => {
      pin.setValue(value);
    });
    this.triggerChange();
  }

  addChangeListener (callback) {
    if (this.changeListeners.indexOf(callback) !== -1) return;

    this.changeListeners.push(callback);
  }

  removeChangeListener (callback) {
    var i = this.changeListeners.indexOf(callback);
    if (i === -1) return;

    this.changeListeners.splice(i, 1);
  }

  triggerChange () {
    this.changeListeners.forEach((fn) => {
      fn(this.value);
    });
  }

  connectTo (otherPin) {
    if (this.destinationPins.indexOf(otherPin) !== -1) return;

    this.destinationPins.push(otherPin);
    otherPin.setSourcePin(this);
  }

  disconnectFrom (otherPin) {
    var i = this.destinationPins.indexOf(otherPin);
    if (i === -1) return;

    this.destinationPins.splice(i, 1);
    otherPin.unsetSourcePin();
  }

  setSourcePin (sourcePin) {
    if (this.sourcePin === sourcePin) return;

    var oldSourcePin = this.sourcePin;
    this.sourcePin = sourcePin;
    if (oldSourcePin) {
      oldSourcePin.disconnectFrom(this);
    }
  }

  unsetSourcePin () {
    if (!this.sourcePin) return;

    this.sourcePin.disconnectFrom(this);
    this.sourcePin = null;
  }
}

export class Node {
  constructor (inputs = 1, outputs = 1, autoCalculate = true) {
    this.inputs = inputs;
    this.outputs = outputs;

    this.inputPins = [];
    repeat(inputs, () => {
      let pin = new Pin;
      this.inputPins.push(pin);
      if (autoCalculate) {
        pin.addChangeListener(() => {
          this.calculateOutputValues();
        });
      }
    });

    this.outputPins = [];
    repeat(outputs, () => {
      let pin = new Pin;
      this.outputPins.push(pin);
    });
  }

  inputPinAt (i) {
    return this.inputPins[i];
  }

  outputPinAt (i) {
    return this.outputPins[i];
  }

  calculateOutputValues () {
  }

  inputPinValues () {
    return this.inputPins.map((pin) => pin.value);
  }

  outputPinValues () {
    return this.outputPins.map((pin) => pin.value);
  }
}


export class And extends Node {
  constructor (n = 2) {
    super(n, 1);
  }

  calculateOutputValues () {
    this.outputPinAt(0).setValue(this.inputPinValues().reduce(logicalAnd, HIGH));
  }
}


export class Or extends Node {
  constructor (n = 2) {
    super(n, 1);
  }

  calculateOutputValues () {
    this.outputPinAt(0).setValue(this.inputPinValues().reduce(logicalOr, LOW));
  }
}


export class Not extends Node {
  constructor () {
    super(1, 1);
  }

  calculateOutputValues () {
    this.outputPinAt(0).setValue(logicalNot(this.inputPinAt(0).value));
  }
}


export class Nand extends Node {
  constructor (n) {
    super(n, 1, false);

    let and = new And(n);
    let not = new Not;

    this.inputPins.forEach((pin, i) => {
      pin.connectTo(and.inputPinAt(i));
    });
    and.outputPinAt(0).connectTo(not.inputPinAt(0));
    not.outputPinAt(0).connectTo(this.outputPinAt(0));
  }
}


export class Nor extends Node {
  constructor (n) {
    super(n, 1, false);

    let or = new Or(n);
    let not = new Not;

    this.inputPins.forEach((pin, i) => {
      pin.connectTo(or.inputPinAt(i));
    });
    or.outputPinAt(0).connectTo(not.inputPinAt(0));
    not.outputPinAt(0).connectTo(this.outputPinAt(0));
  }
}



