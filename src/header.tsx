import * as React from "react";
import { Sun } from "./Sun";
import { Moon } from "./Moon";
import { Clock } from "./Clock";
import styled from "styled-components";
import { connect } from "react-redux";
import { AppState } from "./store";

import { setForecastIntervalAsync } from "./store/forecast/actions";

const HeaderComp = styled.header`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
`;

const StyledSun = styled(Sun)`
  text-align: left;
`;

const StyledMoon = styled(Moon)`
  text-align: center;
`;

const StyledClock = styled(Clock)`
  text-align: right;
`;

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
class HeaderImpl extends React.Component<{}, {}> {
  render() {
    return (
      <HeaderComp>
        <StyledSun />
        <StyledMoon />
        <StyledClock />
        <button />
      </HeaderComp>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  forecastInterval: state.forecast.forecastInterval
});

function mapDispatchToProps(dispatch: any) {
  const actions = {
    setForecastInterval: (days: number) =>
      dispatch(setForecastIntervalAsync(days))
  };
  return actions;
}

export const Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderImpl);
