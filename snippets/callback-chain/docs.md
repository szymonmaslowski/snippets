# Documentation

Table of contents

- [Concept](#concept)
- [Api](#api)
- [Usage Example](#usage-example)

## Concept

`callback-chain` is an implementation of a list which is storing the callback
functions in the entity called _chain_. The whole chain (sequence of callbacks)
could be invoked at any time. Callbacks could be freely appended or removed at
any time, no matter whether the chain has ben already invoked or no.

`callback-chain` does not use any data structure neither to store or point to
next callback in a sequence. It bases its implementation on the javascript
[closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
feature. The trick is that the next chain eyelet of the chain is accessible for
the current one because both are in the same closure.

```javascript
const run = () => {
  const nextEyelet = () => {};
  const currentEyelet = () => {
    nextEyelet();
  };
  currentEyelet();
};
```

## API

### createChain()

The createChain function is what is being exported from the callback-chain module.
It is a factory function that produces the [chain](#chain) object.

```javascript
import createChanin from 'callback-chain';

const chainOne = createChanin();
const chainTwo = createChanin();
```

### chain

The chain is an object with two methods:
  - [chain.append(callback)](#appendcallback--chain)
  - [chain.run([...args])](#runargs--chain)

#### append(callback) => chain

The `chain.append()` accepts a _callback_ argument of function type
and stores/appends it to the callbacks chain (a sequence of callbacks).
It returns the chain instance object, so the methods can be "chained".

The `chain.append()` can be called multiple times regardless the invocation
of the `chain.run()` method. Once the chain is requested
to run, the stored callback gets invoked.

##### callback([...args], removeEyelet)

The `callback` argument is a function which does not have strictly defined
list of arguments. It receives the arguments of the `chain.run()` method.

Despite the arguments inherited from the `chain.run()` method, the
`callback` always receives one additional argument at the last position of the
arguments list, which is the `removeEyelet` function.

The `removeEyelet` function removes particular callback from the chain instance,
which means that particular callback will not be invoked anymore during subsequent
chain executions.

#### run([...args]) => chain

The `chain.run()` runs all callbacks in the chain. Appended callbacks get
invoked in the reversed order of which they have been appended using
`chain.append()` method. All of provided arguments are passed to each callback
in the chain. It returns the chain instance object, so the methods can be "chained".

## Usage example

You can find the advanced usage example [here](./example.js)
