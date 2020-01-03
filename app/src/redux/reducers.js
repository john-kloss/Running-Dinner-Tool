import { combineReducers } from "redux";
import { SET_TIME, SET_TEXT, SET_USE_LOCATION } from "./actions";

const defaultState = {
  time: ["18:00", "19:30", "22:00"],
  text: [
    "Wir freuen uns, dass ihr dabei seid!",
    "Liebe Grüße,\neuer Running Dinner Team"
  ]
};

function dinnerDetails(state = defaultState, action) {
  switch (action.type) {
    case SET_TIME: {
      return Object.assign({}, state, { time: action.payload });
    }
    case SET_TEXT:
      return Object.assign({}, state, { text: action.payload });
    default:
      return state;
  }
}

const defaultSettings = {
  useLocation: true
};

function settings(state = defaultSettings, action) {
  switch (action.type) {
    case SET_USE_LOCATION:
      return Object.assign({}, state, { useLocation: action.payload });
    default:
      return state;
  }
}

const appFunctions = combineReducers({ dinnerDetails, settings });
export default appFunctions;
