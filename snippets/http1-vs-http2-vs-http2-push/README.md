# HTTP/1 vs HTTP/2 vs HTTP/2 push

This snippet shows the performance difference in delivering assets to the browser
between different protocols/strategies. You can notice it by running each server
and watching how fast the page is being rendered.

## Description

There are three servers implementations:
 - [h1](#src/h1.js)
 - [h2](#src/h2.js)
 - [h2-push](#src/h2-push.js)

All of them serve an `index.html` file which renders a number of image assets.

All of those assets are in practice the same file in the file system, but the `index.html` adds
a unique number to each url, so they are considered different resources by the browser
(e.g. `/asset.png?1` and `/asset.png?2`).

In order to highlight the difference in assets delivering performance each server is simulating
a latency via delaying the response. By default the delay is a 300 ms, but you can steer
it via [query param](#steer-with-query-params).

> High latency translates to long time between request start and server response arrival.

## Run

Start all three servers at once:

```bash
yarn start
```

or start a specific server running command:

```bash
yarn start:<type>
```

where `<type>` represents server type from the list above.

Example:

```bash
yarn start:h2-push
```

## Watch

1. Navigate to [https://localhost:3000](https://localhost:3000) in your browser to access server you run.

    > If you used `start` or `start:all` commands all servers will start and will be accessible on ports
    [3000](https://localhost:3000), [3001](https://localhost:3001) and [3002](https://localhost:3002).

1. Confirm the invalid certificate warning (servers use self signed certificate for the TLS connection).
1. Compare performance
    1. See how fast images are being rendered.
    1. Open devtools and navigate to network tab to see the details of how assets has been transferred
    over the network in time

## Steer with query params

You can manipulate two factors by query params:

 - `l` specifying latency time e.g. [https://localhost:3000?l=500](https://localhost:3000?l=500) (default 300)
 - `c` specifying assets count rendered by the `index.html` e.g. [https://localhost:3000?c=200](https://localhost:3000?c=200)  (default 1000)
