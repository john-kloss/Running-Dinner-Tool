//React libraries
import React from "react";
import ReactDOM from "react-dom";

import { AppContainer } from "./containers";
import { createStore } from "redux";
import appFunctions from "./redux/reducers";
import { Provider } from "react-redux";

const store = createStore(appFunctions);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

// Render to index.html
ReactDOM.render(<App />, document.getElementById("content"));
