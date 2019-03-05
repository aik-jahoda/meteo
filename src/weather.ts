import xmlToJson from "xml-to-json-stream";
import moment = require("moment");

export interface Position { lat: number, lon: number }

async function getData(position: Position) {
    const url = `https://api.met.no/weatherapi/locationforecast/1.9/?lat=${position.lat}&lon=${position.lon}`;

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

    throw Error(`Response ${response.status} ${response.statusText}`)

}

export interface LocationTemperature {
    altitude: number;
    latitude: number;
    longtitude: number;

    from: Date;
    to: Date;

    temperature: number;
    dewpointTemperature: number;
    humidity: number;
    windSpeed: { beaufort: number, mps: number, name: string }
    symbol: number;
}

interface LocationTemperatureRaw {
    altitude: string;
    latitude: string;
    longtitude: string;
    temperature: { id: "TTT", unit: "celsius", value: string }
    dewpointTemperature: { id: "TD", unit: "celsius", value: string }
    humidity: { unit: "percent", value: string }
    windSpeed: { beaufort: string, id: "ff", mps: string, name: string }
}

interface LocationSymbolRaw {
    altitude: string;
    latitude: string;
    longtitude: string;
    symbol: { id: string, number: string };
}

interface TimeRaw {
    datatype: "forecast";
    from: string;
    to: string;
    location: LocationTemperatureRaw | LocationSymbolRaw;
}

interface Product {
    class: "pointData"
    time: TimeRaw[]
}

interface WeatherDataRaw {
    created: string;
    product: Product;
}

interface yr {
    weatherdata: WeatherDataRaw
}

export function getSymbolURL(symbol: number) {
    return `https://api.met.no/weatherapi/weathericon/1.1?content_type=image%2fsvg%2Bxml&symbol=${symbol}`
}


function isLocationTemperature(location: LocationTemperatureRaw | LocationSymbolRaw): location is LocationTemperatureRaw {
    return (<LocationTemperatureRaw>location).temperature !== undefined;
}

export async function getWeather(position: Position) {
    const forecast = await getData(position)

    const json = xmlToJson().xmlToJson(forecast, (error, json) => {
        if (error) {
            throw error;
        }
        return json;
    }) as yr;

    //console.log(json)

    const locations = json.weatherdata.product.time//.map(x => ({ ...x.location, from:x.from, to:x.to}));



    const temperatures = locations.reduce<LocationTemperature[]>((previousValue, currentValue, currentIndex, array) => {
        const from = moment(currentValue.from);
        const to = moment(currentValue.to);
        if (currentIndex > 0) {
            const prev = array[currentIndex - 1];
            if (isLocationTemperature(prev.location) && !isLocationTemperature(currentValue.location)) {
                const prevFrom = moment(prev.from);
                if (from.isSame(to.clone().subtract(1, "hour")) && to.isSame(prevFrom)) {
                    const prevTo = moment(prev.to);
                    previousValue.push({
                        from: prevFrom.toDate(),
                        to: prevTo.toDate(),
                        altitude: Number.parseFloat(prev.location.altitude),
                        longtitude: Number.parseFloat(prev.location.longtitude),
                        latitude: Number.parseFloat(prev.location.latitude),
                        dewpointTemperature: Number.parseFloat(prev.location.dewpointTemperature.value),
                        temperature: Number.parseFloat(prev.location.temperature.value),
                        humidity: Number.parseFloat(prev.location.humidity.value),
                        windSpeed: {
                            mps: Number.parseFloat(prev.location.windSpeed.mps),
                            beaufort: Number.parseFloat(prev.location.windSpeed.beaufort),
                            name: prev.location.windSpeed.name
                        }, 
                        symbol: Number.parseInt(currentValue.location.symbol.number)
                    })
                }
            }
        }
        return previousValue;
    }, []);


    return temperatures;

}


