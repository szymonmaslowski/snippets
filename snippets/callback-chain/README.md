# callback-chain

A tool collecting callbacks and invoking them on demand in a sequence, passing
a set of user provided arguments. It implements the linked list without using
any data structure, but rather keeps provided callbacks in the correct order
using the javascript
[closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
feature. Detailed description could be found in the
[concept section of the docs](./docs.md#concept).

## Installation

```
yarn add callback-chain
```

## Basic Usage

```javascript
import createChain from 'callback-chain';

const chain = createChain();

chain.append((run, value) => console.info(`Run ${run}. Consumed "${value}"`));
chain.run(1, 'the value');

chain
  .append((run, value, removeEyelet) => {
    removeEyelet();
    console.info(`Run ${run}. Consumed "${value}" and removed the callback`);
  })
  .run(2, 'another value')
  .run(3, 'yet another value');
```

Output:
```
Run 1. Consumed "the value"
Run 2. Consumed "another value" and removed the callback
Run 2. Consumed "another value"
Run 3. Consumed "yet another value"
```

## Docs
Check out the [docs](./docs.md) for more details.
