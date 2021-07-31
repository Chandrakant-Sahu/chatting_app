// Initialization for Reducer State
export const actionTypes = {
  SIGN_UP: "SIGN_UP",
  LOG_IN: "LOG_IN",
  LOG_OUT: "LOG_OUT",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

export const userStateReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SIGN_UP:
      return {
        ...state,
        loading: action.payload.loading,
        error: action.payload.error,
      };

    case actionTypes.LOG_IN:
      return {
        ...state,
        loading: action.payload.loading,
        error: action.payload.error,
      };

    case actionTypes.LOG_OUT:
      return {
        ...state,
        loading: action.payload.loading,
        error: action.payload.error,
      };

    case actionTypes.SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        loading: action.payload.loading,
        error: action.payload.error,
      };

    case actionTypes.ERROR:
      return {
        ...state,
        loading: action.payload.loading,
        error: action.payload.error,
      };

    default:
      return state;
  }
};
export default userStateReducer;
