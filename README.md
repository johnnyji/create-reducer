# createReducer

Create simple and functional reducers that can listen to multiple action creators.

### Installation

`npm i -S createReducer`

### Usage

Actions need to follow a convention of `{type, data}`, where `type` is the action type
being fired, and `data` is the data associated with the action (if there is any). Otherwise,
we can omit the `data` key.

```javascript
const AuthActionCreators = {

  loginSuccess(user) {
    // Pretend we succesfully logged in
    return {
      type: ActionTypes.LOGIN_SUCCESS,
      data: {currentUser: user}
    };
  },

  logoutSuccess() {
    return {
      type: ActionTypes.LOGOUT_SUCCESS
    };
  }

  // ...
};
```

In your reducer, must provide a `name` and `handlers` key. An action handler can listen to multiple actions being fired if necessary.

```javascript
// src/reducers/AuthReducer.js
import createReducer from 'create-reducer';

// Always provide an initial state to begin with
const initialState = {
  authError: null,
  currentUser: null
};

export default createReducer(initialState, {

  name: 'Authentication',

  handlers: {
    onLogin: [ActionTypes.LOGIN_SUCCESS],
    onLogout: [
      ActionTypes.LOGOUT_SUCCESS,
      ActionTypes.TOKEN_EXPIRED,
      ActionTypes.BLACKLISTED,
      // ... Other actions that trigger a logout
    ]
  },

  // Action handlers receive the current state and the `data` key from the action fired
  // as arguments. You must return a new (altered or unaltered) state from each action creator
  onLogin(state, data) {
    return {...state, data.currentUser};
  },
  
  // Here is an example of an action handler listening to multiple actions
  onLogout() {
    return initialState;
  }

});
```
### Immutable.js

I highly recommend pairing `createReducer` with Immutable.js. Immtuable.js provides immutable datatypes to ensure that
actions handlers don't cause side effects.

The usage is indentical:

```javascript
// Immutable.js Example

import createReducer from 'create-reducer';
import Immutable from 'immutable';

// Always provide an initial state to begin with
const initialState = Immutable.fromJS({
  authError: null,
  currentUser: null
});

export default createReducer(initialState, {

  name: 'Authentication',

  handlers: {
    onLogin: [ActionTypes.LOGIN_SUCCESS],
    onLogout: [
      ActionTypes.LOGOUT_SUCCESS,
      ActionTypes.TOKEN_EXPIRED,
      ActionTypes.BLACKLISTED,
      // ... Other actions that trigger a logout
    ]
  },

  // Action handlers receive the current state and the `data` key from the action fired
  // as arguments. You must return a new (altered or unaltered) state from each action creator
  onLogin(state, data) {
    return state.merge({
      currentUser: data.currentUser
    });
  },
  
  // Here is an example of an action handler listening to multiple actions
  onLogout() {
    return initialState;
  }

});
```

#### Happy Reducing!
