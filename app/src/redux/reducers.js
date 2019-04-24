import { combineReducers } from "redux";
import { SAVE_STATE, SET_TIME, GET_TIME } from "./actions";

function systemState(state = [], action) {
  switch (action.type) {
    case GET_TIME:
      return [...state, { time: "12" }];
    case SET_TIME:
      return action.time;
    default:
      return state;
  }
  // switch (action.type) {
  //   case SAVE_STATE:
  //     return [
  //       ...state,
  //       {
  //         text: action.text,
  //         completed: false
  //       }
  //     ];
  // }
}

const appFunctions = combineReducers({ systemState });
export default appFunctions;
