export const SET_TIME = "SET_TIME";
export const setTime = time => {
  return { type: SET_TIME, time };
};

export const GET_TIME = "GET_TIME";
export const getTime = () => {
  return { type: GET_TIME };
};
