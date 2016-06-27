var createReducer = require('../lib/index');
var expect = require('expect');
var Immutable = require('immutable');

describe('createReducer', function() {
  var ActionTypes = {
    ACTION_ONE: 'ACTION_ONE',
    ACTION_TWO: 'ACTION_TWO',
    ACTION_THREE: 'ACTION_THREE'
  };

  describe('When the datatype is Immutable.js', function() {
    var initialState = Immutable.fromJS({hello: 'world'});

    it('should have the have the correct initial state', function() {
      var action = {type: "SOME_FAKE_ACTION", data: {fake: 'data'}};
      var reducer = createReducer(initialState, {
        name: '',
        handlers: {}
      });
      var state = reducer(undefined, action);
      expect(Immutable.is(state, initialState)).toBe(true);
    });

    it('should call the correct action handler', function() {
      var action = {type: ActionTypes.ACTION_ONE, data: {hello: 'universe'}};
      var actionHandler = expect.createSpy();
      var reducer = createReducer(initialState, {
        name: '',
        handlers: {
          onActionOne: [ActionTypes.ACTION_ONE]
        },
        onActionOne: actionHandler
      });

      // Simulates an action firing and the reducer executing
      reducer(undefined, action);

      // The correct action handler function should have fired
      // with the right arguments
      expect(actionHandler.calls.length).toBe(1);
      expect(actionHandler).toHaveBeenCalledWith(initialState, action.data);
    });

    it('should call the correct action handler and alter the state accordingly', function() {
      var action = {type: ActionTypes.ACTION_ONE, data: {captain: 'Han Solo'}};
      var reducer = createReducer(initialState, {
        name: '',
        handlers: {
          onActionOne: [ActionTypes.ACTION_ONE],
          anotherAction: [ActionTypes.ACTION_THREE]
        },
        onActionOne: function(state, data) {
          return state.merge(data);
        },
        anotherAction: function() {
          return 'Should not be called!';
        }
      });

      // Simulates an action firing and the reducer executing
      const newState = reducer(undefined, action);

      // The state should now be different
      expect(Immutable.is(initialState, newState)).toBe(false);
      
      // The state should have been altered correctly
      expect(newState.has('captain')).toBe(true);
      expect(newState.get('captain')).toBe('Han Solo');
    });

    it('should be able to respond to multiple actions with the same handler', function() {
      var actionOne = {type: ActionTypes.ACTION_ONE, data: {}};
      var actionTwo = {type: ActionTypes.ACTION_TWO, data: {}};
      var actionThree = {type: ActionTypes.ACTION_THREE, data: {}};
      var expectedState = Immutable.fromJS({yolo: 'YOOOLLLOOOOOOO'});
      var reducer = createReducer(initialState, {
        name: '',
        handlers: {
          onSomeAction: [
            ActionTypes.ACTION_ONE,
            ActionTypes.ACTION_TWO,
            ActionTypes.ACTION_THREE
          ]
        },
        onSomeAction: function() {
          return expectedState;
        }
      });

      // Simulates firing the action and gets the new state from the reducer
      const firstState = reducer(undefined, actionOne);
      const secondState = reducer('bleerrr', actionTwo);
      const thirdState = reducer('doesnt matter', actionThree);
      
      // Regardless of the action fired, they should all return the same state, because
      // they should have benn handled by the same handler
      expect(Immutable.is(firstState, expectedState)).toBe(true);
      expect(Immutable.is(secondState, expectedState)).toBe(true);
      expect(Immutable.is(thirdState, expectedState)).toBe(true);
    });

  });

  describe('When the datatype is native JS', function() {
    var initialState = {hello: 'world'};

    it('should have the have the correct initial state', function() {
      var action = {type: "SOME_FAKE_ACTION", data: {fake: 'data'}};
      var reducer = createReducer(initialState, {
        name: '',
        handlers: {}
      });
      var state = reducer(undefined, action);
      expect(state).toEqual(initialState);
    });

    it('should call the correct action handler', function() {
      var action = {type: ActionTypes.ACTION_ONE, data: {hello: 'universe'}};
      var actionHandler = expect.createSpy();
      var reducer = createReducer(initialState, {
        name: '',
        handlers: {
          onActionOne: [ActionTypes.ACTION_ONE]
        },
        onActionOne: actionHandler
      });

      // Simulates an action firing and the reducer executing
      reducer(undefined, action);

      // The correct action handler function should have fired
      // with the right arguments
      expect(actionHandler.calls.length).toBe(1);
      expect(actionHandler).toHaveBeenCalledWith(initialState, action.data);
    });

    it('should call the correct action handler and alter the state accordingly', function() {
      var action = {type: ActionTypes.ACTION_ONE, data: {captain: 'Han Solo'}};
      var reducer = createReducer(initialState, {
        name: '',
        handlers: {
          onActionOne: [ActionTypes.ACTION_ONE],
          anotherAction: [ActionTypes.ACTION_THREE]
        },
        onActionOne: function(state, data) {
          return Object.assign({}, state, data);
        },
        anotherAction: function() {
          return 'Should not be called!';
        }
      });

      // Simulates an action firing and the reducer executing
      const newState = reducer(undefined, action);

      // The state should now be different
      expect(initialState).toNotEqual(newState);
      
      // The state should have been altered correctly
      expect(newState).toIncludeKeys(['hello', 'captain']);
      expect(newState.captain).toBe('Han Solo');
    });

    it('should be able to respond to multiple actions with the same handler', function() {
      var actionOne = {type: ActionTypes.ACTION_ONE, data: {}};
      var actionTwo = {type: ActionTypes.ACTION_TWO, data: {}};
      var actionThree = {type: ActionTypes.ACTION_THREE, data: {}};
      var expectedState = {yolo: 'YOOOLLLOOOOOOO'};
      var reducer = createReducer(initialState, {
        name: '',
        handlers: {
          onSomeAction: [
            ActionTypes.ACTION_ONE,
            ActionTypes.ACTION_TWO,
            ActionTypes.ACTION_THREE
          ]
        },
        onSomeAction: function() {
          return expectedState;
        }
      });

      // Simulates firing the action and gets the new state from the reducer
      const firstState = reducer(undefined, actionOne);
      const secondState = reducer('bleerrr', actionTwo);
      const thirdState = reducer('doesnt matter', actionThree);
      
      // Regardless of the action fired, they should all return the same state, because
      // they should have benn handled by the same handler
      expect(firstState).toEqual(expectedState);
      expect(secondState).toEqual(expectedState);
      expect(thirdState).toEqual(expectedState);
    });

  });

});
