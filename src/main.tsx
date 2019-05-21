import * as React from "react";
import { WeatherChart } from "./weatherChart/WeatherChart";
import styled from "styled-components";

const TemperatureBox = styled.div`
  font-size: 3rem;
  sup {
    font-size: 1rem;
  }
`;

export const Main = () => {
  return (
    <main className="main">
      <TemperatureBox>
        <sup>in</sup> 9°C
      </TemperatureBox>

      <TemperatureBox>
        <sup>out</sup> 19°C
      </TemperatureBox>
      <WeatherChart />
    </main>
  );
};
