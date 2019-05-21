import * as React from "react";
import { AppState } from "./store";
import { connect } from "react-redux";
import * as d3 from "d3";
import styled from "styled-components";

const mapStateToProps = (state: AppState) => ({
  moon: state.app.moon
});

const MoonBox = styled.span`
  font-family: "Noto Emoji", sans-serif;
`;

const moons = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"].reverse();

const moonMap = d3
  .scaleThreshold<number, string>()
  .range(moons)
  .domain(moons.map((x, i, a) => (100 / (a.length + 1)) * (i + 1)));

const moon = (
  props: ReturnType<typeof mapStateToProps> & { className?: string }
) => (
  <MoonBox className={props.className}>
    {moonMap(props.moon.illumination * 100)}
  </MoonBox>
);

export const Moon = connect(mapStateToProps)(moon);
