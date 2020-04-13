# Countdown

#### Prerequisite
[Snippets 1-5](../../../redux-saga-effects-showcase/snippets)

#### Description
Application renders a button whose role is to trigger countdown feature by sending `COUNTDOWN_REQUESTED` action. The countdown feature logs messages to the console. It logs beginning message, a number every second in descending order and final message. A starting number is provided by `COUNTDOWN_REQUESTED` action payload. If the button gets clicked in the middle of counting then countdown starts from the beginning. Example console output where button has been clicked again after `4` was logged:

```
// button click
Counting down!
5
// 1 second
4
// button click
Counting down!
5
4
3
2
1
Finished!
```

#### Goals
1. Implement `takeLatest()` effect helper using other basic effects
1. Fix implementation of `onCountdownRequested()` handler (hardcoded time value and a missing pause between logs)

#### Restrictions
Modify only `takeLatest()` and `onCountdownRequested()` functions in `saga.js` file
