import { getForecast } from "../../forecast/weather";
import { ThunkAction } from "redux-thunk";
import { AppState } from "..";
import { Unpacked } from "../../utils";

export type ForecastActionTypes = UpdateForeacstAction;

type ThunkResult<R> = ThunkAction<R, AppState, undefined, ForecastActionTypes>;

type UpdateForeacstAction =
  | ReturnType<typeof updateForecast>
  | ReturnType<typeof setForecastInterval>;

type Forecast = Unpacked<ReturnType<typeof getForecast>>;

const setForecastInterval = (days: number) => {
  return {
    type: "UPDATE_FORECAST_INTERVAL" as "UPDATE_FORECAST_INTERVAL",
    days: days
  };
};

const updateForecast = (forecast: Forecast) => {
  return {
    type: "UPDATE_FORECAST" as "UPDATE_FORECAST",
    forecast: forecast
  };
};

export const updateForecastAsync: () => ThunkResult<void> = () => async (
  dispatcher,
  getState
) => {
  const { longtitude: lon, latitude: lat } = getState().app.currentPosition;
  const weather = await getForecast(
    { lon, lat },
    getState().forecast.forecastInterval
  );
  dispatcher(updateForecast(weather));
};

export const setForecastIntervalAsync: (days: number) => ThunkResult<void> = (
  days: number
) => async (dispatcher, getState) => {
  dispatcher(setForecastInterval(days));
  updateForecastAsync();
};
