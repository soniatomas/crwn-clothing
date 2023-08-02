import { createSlice } from '@reduxjs/toolkit';
// import { USER_ACTION_TYPES } from './user.types';

const INITIAL_STATE = {
  currentUser: null,
};

// createSlice creates the reducer, actions, and action types. 
// name value is the name of the slice and will be used to name actions
// 
export const userSlice = createSlice({
  name: 'users',
  initialState: INITIAL_STATE,
  // reducers is given the function namespace that will be the reducer.
  // setCurrentUser actually returns a new object, even though it looks like
  // its assigning the state object a value. 
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    }
  }
})

// exporting the actions and the reducer
export const { setCurrentUser } = userSlice.actions;
export const userReducer = userSlice.reducer;