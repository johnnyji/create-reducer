'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (initialState, opts) {
  // An object containing the action handler functions as keys and
  // an array of actions they should response to as values, ie:
  //
  // {
  //   onUpdateCurrentUser: [
  //     AuthActionTypes.FETCH_CURRENT_USER_SUCCESS,
  //     OnboardingActionTypes.WRITE_NAME_SUCCESS
  //   ],
  //   onSetFlashAlert: [
  //     AuthActionTypes.FETCH_CURRENT_USER_ERROR,
  //     MessageActionTypes.SAVE_MESSAGE_ERROR
  //   ],
  //   ...
  // }
  var handlers = opts.handlers;
  var name = opts.name;

  var reducerTitle = name ? 'the ' + name + ' reducer' : 'your reducer';

  if (name == null) {
    console.warn('One of your reducers is missing a `name` property in its object definition.');
  }

  if (handlers == null) {
    console.warn('The \'handlers\' key must be present in ' + reducerTitle + ' to listen to action types');
    handlers = [];
  }

  /**
   * The is the actual reducer function that will be executed by Redux
   * @param {*} state - The state that this reducer is responsible for
   * @param {Object} action - The current action that is being fired
   * @returns {*} - The new state
   */
  return function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments[1];
    var currentActionType = action.type;
    var currentActionData = action.data;

    // This will reduce over the existing state with each action handler, allowing them to alter
    // the state if the one of their actions is the one fired, returning an updated state

    return Object.keys(handlers).reduce(function (currentState, actionHandler) {
      var actionTypes = handlers[actionHandler];

      // If the current action fired matches one of the action types
      // attached to this specific handler, we call the handler function
      if (actionTypes.indexOf(currentActionType) > -1) {

        // If the action handler function cannot be found on the reducer object definition,
        // we return the state as/is and issue a console error to the developer
        if (typeof opts[actionHandler] !== 'function') {
          console.warn('The \'' + actionHandler + '\' handler function doesn\'t exist on ' + reducerTitle + '.');
          return currentState;
        }

        // We return the action handler call, and action handler calls
        // will always return a new state, thus we're returning the
        // newly updated state
        var updatedState = opts[actionHandler].call(null, currentState, currentActionData);

        if (typeof updatedState === 'undefined') {
          // If the new state was never returned, alert the user and instead just return the current state.
          console.error('Action handlers in reducers must return the new state. ' + ('Check the \'' + actionHandler + '\' handler on ' + reducerTitle + '.'));
          return currentState;
        }

        return updatedState;
      }

      return currentState;
    }, state);
  };
};

;
module.exports = exports['default'];