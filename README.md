# Logic circuit simulator

## example

```javascript
// y = (x1 + !x2) * x3

import {HIGH, LOW, And, Or, Not, Pin} from 'logic';

let or = new Or(2);
let and = new And(2);
let not = new Not;

let x1 = new Pin(LOW);
let x2 = new Pin(LOW);
let x3 = new Pin(LOW);
let y = new Pin;

x1.connectTo(or.inputPinAt(0));
x2.connectTo(not.inputPinAt(0));
not.connectTo(or.inputPinAt(1));
or.connectTo(and.inputPinAt(0));
x3.connectTo(and.inputPinAt(1));
and.connectTo(out);

out.addChangeListener((value) => {
  console.log('out:', value);
});

x1.setValue(HIGH);
// out: 0

x3.setValue(HIGH);
// out: 1

x2.setValue(HIGH);
// out: 0
```
