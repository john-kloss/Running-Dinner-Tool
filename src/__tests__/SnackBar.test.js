import React from "react";
import {
  render,
  fireEvent,
  waitForElement,
  getByLabelText,
  getByTestId
} from "@testing-library/react";
import { AppContainer, UploadContainer } from "../containers";
import { UploadButton } from "../components";
import Reducer from "../redux/reducers";
import { setTime, setText } from "../redux/actions";

import { createStore } from "redux";
import appFunctions from "../redux/reducers";
import { Provider } from "react-redux";
const store = createStore(appFunctions);

test("UploadButton", () => {
  const { getByText, getByLabelText, getByTestId } = render(
    <Provider store={store}>
      <UploadButton />
    </Provider>
  );
  fireEvent.click(getByLabelText("Upload"));
  fireEvent.change(getByTestId("csvInput"), {
    target: { files: ["Rudi 2019.csv"] }
  });
  // getByTestId("csvInput").onChange({ event: { target: { result: {} } } });
});

// test("Text in state is changed when button clicked", () => {
//   const { debug, getByText } = render(<TestHook />);
//   // debug();

//   expect(getByText(/Initial/i).textContent).toBe("Initial State");

//   fireEvent.click(getByText("State Change Button"));

//   expect(getByText(/Initial/i).textContent).toBe("Initial State Changed");
// });

// test("Reducer", () => {
//   console.log(Reducer.length);
//   expect(Reducer.dinnerDetails({}, setTime)).toEqual({
//     time: false
//   });
// });

test("UploadContainer renders", () => {
  const { getByText, getByLabelText } = render(
    <Provider store={store}>
      <UploadContainer
        city={"Berlin"}
        onCityChanged={() => console.log("test")}
      />
    </Provider>
  );

  expect(getByText(/Vorlage/i).childElementCount).toBe(1);
  expect(getByLabelText(/Stadt/i).value).toBe("Berlin");

  fireEvent.change(getByLabelText(/Stadt/), {
    target: { value: "Text" }
  });

  // expect(screen.getByText(/^My Name Is:/)).toHaveTextContent(
  //   "My Name Is: Unknown"
  // );
});
