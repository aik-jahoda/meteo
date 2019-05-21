import * as SunCalc from "suncalc2";
import { AppActionTypes } from "./actions";

type AppState = typeof initialState;

const initialState = {
  sun: {
    sunrise: new Date(),
    sunset: new Date()
  },
  moon: {
    illumination: 0
  },
  currentPosition: { latitude: 50.0755381, longtitude: 14.4378005 }
  //currentPosition: { latitude: 80.0755381, longtitude: 14.4378005 }
};

export function appReducer(
  state = initialState,
  action: AppActionTypes
): AppState {
  switch (action.type) {
    case "UPDATE_SUN":
      const times = SunCalc.getTimes(
        new Date(),

        state.currentPosition.latitude,
        state.currentPosition.longtitude
      );
      return {
        ...state,
        sun: {
          sunrise: times.sunrise,
          sunset: times.sunset
        }
      };

    case "UPDATE_MOON":
      const illumination = SunCalc.getMoonIllumination(new Date());
      return {
        ...state,
        moon: {
          illumination: illumination.fraction
        }
      };

    default:
      return state;
  }
}
