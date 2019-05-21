import { ForecastActionTypes } from "./actions";
import { Unpacked } from "../../utils";
import { getForecast } from "../../forecast/weather";

type Forecast = Unpacked<ReturnType<typeof getForecast>>;

type ForecastState = typeof initialState;

const initialState = {
  weather: [] as Forecast,
  forecastInterval: 3
};

export function forecastReducer(
  state = initialState,
  action: ForecastActionTypes
): ForecastState {
  switch (action.type) {
    case "UPDATE_FORECAST":
      return {
        ...state,
        weather: action.forecast
      };
    case "UPDATE_FORECAST_INTERVAL":
      return {
        ...state,
        forecastInterval: action.days
      };
    default:
      return state;
  }
}
