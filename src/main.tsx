import * as React from "react";
import { getWeather, LocationTemperature } from "./weather";

interface MainState {
    weather: LocationTemperature[];
}

export class Main extends React.Component<{}, MainState> {

    constructor(prop: Readonly<{}>) {
        super(prop);

        this.state = { weather: [] };

        setInterval(this.updateWeather, 1000);

    }

    readonly updateWeather = async ()=> {
        const forecast = await getWeather({ lat: 50.0, lon: 14.4 })

        this.setState({ weather: forecast })
    }

    render() {

        const images = this.state.weather.map((x, i)=> (<div key={i}> {x.temperature} {x.humidity} {x.from.toLocaleTimeString()} </div>))

            return(
                <main className="main">
                 {images}
                    <div className="card cardTemplate weather-forecast" hidden>
                        <div className="city-key" hidden></div>
                        <div className="card-last-updated" hidden></div>
                        <div className="location"></div>
                        <div className="date"></div>
                        <div className="description"></div>
                        <div className="current">
                            <div className="visual">
                                <div className="icon"></div>
                                <div className="temperature">
                                    <span className="value"></span><span className="scale">°F</span>
                                </div>
                            </div>
                            <div className="description">
                                <div className="humidity"></div>
                                <div className="wind">
                                    <span className="value"></span>
                                    <span className="scale">mph</span>
                                    <span className="direction"></span>°
                      </div>
                                <div className="sunrise"></div>
                                <div className="sunset"></div>
                            </div>
                        </div>
                        <div className="future">
                            <div className="oneday">
                                <div className="date"></div>
                                <div className="icon"></div>
                                <div className="temp-high">
                                    <span className="value"></span>°
                      </div>
                                <div className="temp-low">
                                    <span className="value"></span>°
                      </div>
                            </div>
                            <div className="oneday">
                                <div className="date"></div>
                                <div className="icon"></div>
                                <div className="temp-high">
                                    <span className="value"></span>°
                      </div>
                                <div className="temp-low">
                                    <span className="value"></span>°
                      </div>
                            </div>
                            <div className="oneday">
                                <div className="date"></div>
                                <div className="icon"></div>
                                <div className="temp-high">
                                    <span className="value"></span>°
                      </div>
                                <div className="temp-low">
                                    <span className="value"></span>°
                      </div>
                            </div>
                            <div className="oneday">
                                <div className="date"></div>
                                <div className="icon"></div>
                                <div className="temp-high">
                                    <span className="value"></span>°
                      </div>
                                <div className="temp-low">
                                    <span className="value"></span>°
                      </div>
                            </div>
                            <div className="oneday">
                                <div className="date"></div>
                                <div className="icon"></div>
                                <div className="temp-high">
                                    <span className="value"></span>°
                      </div>
                                <div className="temp-low">
                                    <span className="value"></span>°
                      </div>
                            </div>
                            <div className="oneday">
                                <div className="date"></div>
                                <div className="icon"></div>
                                <div className="temp-high">
                                    <span className="value"></span>°
                      </div>
                                <div className="temp-low">
                                    <span className="value"></span>°
                      </div>
                            </div>
                            <div className="oneday">
                                <div className="date"></div>
                                <div className="icon"></div>
                                <div className="temp-high">
                                    <span className="value"></span>°
                      </div>
                                <div className="temp-low">
                                    <span className="value"></span>°
                      </div>
                            </div>
                        </div>
                    </div>
                </main>);
    }
}
