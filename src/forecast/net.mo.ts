import xmlToJson from "xml-to-json-stream";
import moment from "moment";

export interface Position {
  lat: number;
  lon: number;
}

async function getData(position: Position) {
  const url = `https://api.met.no/weatherapi/locationforecast/1.9/?lat=${
    position.lat
  }&lon=${position.lon}`;

  const storedValue = localStorage.getItem(url);
  if (storedValue) {
    return storedValue;
  }

  const response = await fetch(url);

  if (response.ok) {
    const text = await response.text();
    localStorage.setItem(url, text);
    return text;
  }

  throw Error(`Response ${response.status} ${response.statusText}`);
}

interface LocationTemperature {
  altitude: string;
  latitude: string;
  longitude: string;
  temperature: { id: "TTT"; unit: "celsius"; value: string };
  dewpointTemperature: { id: "TD"; unit: "celsius"; value: string };
  humidity: { unit: "percent"; value: string };
  windSpeed: { beaufort: string; id: "ff"; mps: string; name: string };
}

interface LocationSymbol {
  altitude: string;
  latitude: string;
  longitude: string;
  symbol?: { id: string; number: string };
  precipitation?: { unit: string; value: string };
}

interface Time {
  datatype: "forecast";
  from: string;
  to: string;
  location: LocationTemperature | LocationSymbol;
}

interface Product {
  class: "pointData";
  time: Time[];
}

interface WeatherData {
  created: string;
  product: Product;
}

interface Yr {
  weatherdata: WeatherData;
}

export function isLocationTemperature(
  location: LocationTemperature | LocationSymbol
): location is LocationTemperature {
  return (<LocationTemperature>location).temperature !== undefined;
}

export async function getWeatherData(position: Position) {
  const forecast = await getData(position);

  const json = xmlToJson().xmlToJson(forecast, (error, json) => {
    if (error) {
      throw error;
    }
    return json;
  }) as Yr;

  //return json;
  //json.weatherdata;

  console.log(json);

  return {
    weatherdata: {
      created: moment(json.weatherdata.created),
      product: {
        class: json.weatherdata.product.class,
        time: json.weatherdata.product.time.map(x => ({
          from: moment(x.from),
          to: moment(x.to),
          datatype: x.datatype,
          location: isLocationTemperature(x.location)
            ? {
                altitude: Number.parseFloat(x.location.altitude),
                latitude: Number.parseFloat(x.location.latitude),
                longitude: Number.parseFloat(x.location.longitude),
                temperature: {
                  id: x.location.temperature.id,
                  unit: x.location.temperature.unit,
                  value: Number.parseFloat(x.location.temperature.value)
                },
                dewpointTemperature: {
                  id: x.location.dewpointTemperature.id,
                  unit: x.location.dewpointTemperature.unit,
                  value: Number.parseFloat(x.location.dewpointTemperature.value)
                },
                humidity: {
                  unit: x.location.humidity.unit,
                  value: Number.parseFloat(x.location.humidity.value)
                },
                windSpeed: {
                  beaufort: Number.parseFloat(x.location.windSpeed.beaufort),
                  id: x.location.windSpeed.id,
                  mps: Number.parseFloat(x.location.windSpeed.mps),
                  name: x.location.windSpeed.name
                }
              }
            : {
                altitude: Number.parseFloat(x.location.altitude),
                latitude: Number.parseFloat(x.location.latitude),
                longitude: Number.parseFloat(x.location.longitude),
                symbol: x.location.symbol
                  ? {
                      id: x.location.symbol.id,
                      number: Number.parseInt(x.location.symbol.number)
                    }
                  : undefined,
                precipitation: x.location.precipitation
                  ? {
                      unit: x.location.precipitation.unit,
                      value: Number.parseFloat(x.location.precipitation.value)
                    }
                  : undefined
              }
        }))
      }
    }
  };
}
