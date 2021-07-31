import React, { createContext, useReducer } from "react";
import { userStateReducer } from "./reducer";

export const StateContext = createContext(); // CONTEXT FOR MANAGING USER ACTIVITIES

const initialState = {
  user: null,
  loading: true,
  success: false,
  error: false,
};

// PROVIDER FOR HANDLING USER ACTIVITIES
export const StateProvider = (props) => {
  const [state, dispatch] = useReducer(userStateReducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {props.children}
    </StateContext.Provider>
  );
};
