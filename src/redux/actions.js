export const SET_TIME = "SET_TIME";
export const setTime = time => {
  return { type: SET_TIME, payload: time };
};

export const SET_TEXT = "SET_TEXT";
export const setText = text => {
  console.log(text);
  return { type: SET_TEXT, payload: text };
};

export const SET_USE_LOCATION = "SET_USE_LOCATION";
export const setUseLocation = useLocation => {
  return { type: SET_USE_LOCATION, payload: useLocation };
};
