import { combineReducers } from "redux";
import { SET_TIME, SET_TEXT, SET_USE_LOCATION } from "./actions";

const defaultState = {
  time: [
    new Date("December 17, 1995 18:00"),
    new Date("December 17, 1995 19:30"),
    new Date("December 17, 1995 21:00")
  ],
  text: [
    "Wir freuen uns, dass ihr dabei seid!",
    "Liebe Grüße,\neuer Running Dinner Team"
  ]
};

function dinnerDetails(state = defaultState, action) {
  console.log(action);
  switch (action.type) {
    case SET_TIME:
      let newTime = state.time.slice();
      newTime.splice(action.payload.mealIndex, 1, action.payload.time);
      return { ...state, time: newTime };
      return {
        ...state,
        time: [
          ...state.time,
          (state.time[action.payload.mealIndex]: action.payload.time)
        ]
      };

    case SET_TEXT:
      let newText = state.text.slice();
      newText.splice(action.payload.textIndex, 1, action.payload.text);
      return { ...state, text: newText };
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
