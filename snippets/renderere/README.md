# Renderere

> This package is not published yet, so you can't install it.

Component based lightweight HTML builder.

`Rendere` is inspired by [React](https://reactjs.org/) in terms of its principles:

 - component-based
 - declarative
 
`Rnderere` is however far less powerful than React 😵💔, **but it doesn't aspire to!**

**The key concept behind is to have minimal set of functionalities to comfortably build small apps.**

If
 - you want to create a simple web page (e.g. landing page),
 - using React or other frontend framework would be an overkill in your case,
 - you see benefits coming from componentization,
 - you got used to writing everything in JS,
 
then give `Renderere` a chance! 👍

## Basics

`Renderere` is string based.

1. You create components returning string representation of an HTML.
1. You use your components to compose the app markup string.
1. You render composed app markup string.

There are two function provided:
 - `makeComponent` - a helper function for creating components,
 - `render` - a function which attaches app markup to the a given dom element.

Read more about them in the [API](api) section.

## Example

There is a simple counter app. You can check its implementation [here](./example.js) and run it using `yarn example` command.

Counter app consists of few components:
 - `Layout` giving the page a shape,
 - `Button` attaching onClick callback,
 - `Logger` not rendering anything, but doing a side effect - a console log.

App markup is being composed by the `makeTree` function returning it as a string.

There is also the `increase` function which has two responsibilities:
 - calculating next state (increasing counter value),
 - triggering page re-render with the next state.

## API

to be provided..
