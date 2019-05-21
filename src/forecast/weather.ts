import { getWeatherData, Position } from "./net.mo";
import moment from "moment";

export type Data = {
  to: moment.Moment;
  temperature: number;
  windSpeed: number;
  dewpointTemperature: number;
  summary: Summary[];
};

export type Summary = {
  duration: number;
  precipitation: number;
  symbol: number;
};

export type WeatherData = Data[];

export async function getForecast(position: Position, days: number) {
  const json = await getWeatherData(position);

  console.log(json);

  let lastData: Data | undefined = undefined;

  const data: WeatherData = [];

  for (const time of json.weatherdata.product.time) {
    if (lastData === undefined || !lastData.to.isSame(time.to)) {
      lastData = {
        to: time.to,
        temperature: 0,
        windSpeed: 0,
        dewpointTemperature: 0,
        summary: []
      };
      data.push(lastData);
    }
    if (time.to.isSame(time.from)) {
      if (time.location.temperature) {
        lastData.temperature = time.location.temperature.value;
      }
      if (time.location.windSpeed) {
        lastData.windSpeed = time.location.windSpeed.mps;
      }
      if (time.location.dewpointTemperature) {
        lastData.dewpointTemperature = time.location.dewpointTemperature.value;
      }
    } else {
      const loc: Data["summary"][0] = {
        duration: time.to.diff(time.from, "hours"),
        precipitation: 0,
        symbol: 0
      };
      lastData.summary.push(loc);

      if (time.location.precipitation) {
        loc.precipitation = time.location.precipitation.value;
      }

      if (time.location.symbol) {
        loc.symbol = time.location.symbol.number;
      }
    }
  }

  if (data.length === 0) {
    return data;
  }

  const toDate = data[0].to.clone().add(days, "days");
  console.log("get data");
  return data.filter(x => x.to.isBefore(toDate));
}
