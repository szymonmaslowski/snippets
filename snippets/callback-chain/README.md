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

chain.append((value, removeEyelet) => {
  console.info('Consumed', value);
  removeEyelet();
});

chain.run('the value');
chain.run('another value');
```

Output:
```
Consumed the value
```

## Docs
Check out the [docs](./docs.md) for more details.
