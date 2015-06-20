# Case: Making Bacon Chat with WebRTC integration

Start the project by cloning the repo, change directory to `big-case`,
and install dependencies:

```
npm install
```


## Running project

You'll have 3 commands to help you out:


### Starting a static file server at http://localhost:3000
```
npm run serve
```


### Building all less and JS
```
npm run build
```


### Building all less and JS on file change (watching)
```
npm run watch
```


## Working on the case.

The implementation should be done in [/browser/main.js](./browser/main.js).

There are some helper modules found in [/browser/lib](./browser/lib):

- [/browser/lib/chat.js](./browser/lib/chat.js): EventEmitter handling all Chat communication
- [/browser/lib/webrtc.js](./browser/lib/webrtc.js): Converts WebRTC to an FRP EventSource
- [/browser/lib/helpers.js](./browser/lib/helpers.js): Collection of helpers (regexes, templates etc)



### Result

We are building a chat for talking about bacon in any size of form:

![BaconChat](https://raw.githubusercontent.com/bekkopen/funksjonell-js/gh-pages/dag2/big-case/baconchat.png)
