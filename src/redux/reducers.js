import { combineReducers } from "redux";
import { SET_TIME, SET_TEXT, SET_USE_LOCATION, SET_DIALOG } from "./actions";

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
  switch (action.type) {
    case SET_TIME:
      let newTime = state.time.slice();
      newTime.splice(action.payload.mealIndex, 1, action.payload.time);
      return { ...state, time: newTime };

    case SET_TEXT:
      let newText = state.text.slice();
      newText.splice(action.payload.textIndex, 1, action.payload.text);
      return { ...state, text: newText };
    default:
      return state;
  }
}

const defaultSettings = {
  useLocation: false
};

function settings(state = defaultSettings, action) {
  switch (action.type) {
    case SET_USE_LOCATION:
      return Object.assign({}, state, { useLocation: action.payload });
    default:
      return state;
  }
}

const defaultDialog = {
  open: false,
  title: "default title",
  content: "default content"
};

function dialog(state = defaultDialog, action) {
  switch (action.type) {
    case SET_DIALOG: {
      return {
        ...state,
        open: action.payload.open,
        title: action.payload.title,
        content: action.payload.content
      };
    }
    default:
      return state;
  }
}

const appFunctions = combineReducers({ dinnerDetails, settings, dialog });
export default appFunctions;
