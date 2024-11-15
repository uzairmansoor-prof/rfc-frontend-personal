import "react-toastify/dist/ReactToastify.css";
import RouteContainer from "./components/routes";
import { LoadingSpinner } from "./components/spinner";

import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Provider store={store}>
      <LoadingSpinner />
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer />
        <RouteContainer />
      </PersistGate>
    </Provider>
  );
};

export default App;
