import { HANDLE_LOGOUT, SAVE_SUCCESSFUL_AUTH } from '../actions/authentication';

export const initialState = {
  isLogged: false,
  user: null,
  token: '',
};

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case HANDLE_LOGOUT: return { ...state, isLogged: false };
    case SAVE_SUCCESSFUL_AUTH: return {
      ...state,
      isLogged: true,
      token: action.data.token,
      // user:action.data.user,
    };
    default:
      return state;
  }
};

export default reducer;
