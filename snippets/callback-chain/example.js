// eslint-disable-next-line import/no-extraneous-dependencies
import createChain from 'callback-chain';

const chain = createChain();

chain.append((jobName, ready, removeEyelet) => {
  console.info(` - "zero" callback received arguments: "${jobName}" ${ready}`);
  if (jobName === 'zero' && ready) {
    console.info(' - removing callback for "zero"');
    removeEyelet();
  }
});
chain.append((jobName, ready, removeEyelet) => {
  console.info(` - "two" callback received arguments: "${jobName}" ${ready}`);
  if (jobName === 'two' && ready) {
    console.info(' - removing callback for "two"');
    removeEyelet();
  }
});

setTimeout(() => {
  console.info('Running the chain with arguments: "zero" true');
  chain.run('zero', true);
  console.info('Running the chain with arguments: "one" false');
  chain.run('one', false);
  console.info('Running the chain with arguments: "two" true');
  chain.run('two', true);
  console.info('Running the chain with arguments: "three" true');
  chain.run('three', true);
}, 0);

/*
OUTPUT:

Running the chain with arguments: "zero" true
 - "two" callback received arguments: "zero" true
 - "zero" callback received arguments: "zero" true
 - removing callback for "zero"
Running the chain with arguments: "one" false
 - "two" callback received arguments: "one" false
Running the chain with arguments: "two" true
 - "two" callback received arguments: "two" true
 - removing callback for "two"
Running the chain with arguments: "three" true
 */
