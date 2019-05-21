import { applyMiddleware, combineReducers, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { updateSun, updateMoon } from "./app/actions";
import { appReducer } from "./app/reducers";
import { updateForecastAsync } from "./forecast/actions";
import { forecastReducer } from "./forecast/reducers";

const rootReducer = combineReducers({
  app: appReducer,
  forecast: forecastReducer
});

export type AppState = ReturnType<typeof rootReducer>;

const loggerMiddleware = createLogger();

const registerSunUpdate = (store: { dispatch: any }) => {
  const tick = () => {
    store.dispatch(updateSun());
    store.dispatch(updateMoon());
    store.dispatch(updateForecastAsync());
  };

  tick();

  window.setInterval(tick, 60 * 60 * 1000);
};

export default function configureStore() {
  const store = createStore(
    rootReducer,
    applyMiddleware(thunkMiddleware, loggerMiddleware)
  );

  registerSunUpdate(store);

  return store;
}
