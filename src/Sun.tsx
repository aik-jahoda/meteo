import moment from "moment";
import * as React from "react";
import { connect } from "react-redux";
import { AppState } from "./store";
import { ReactComponent as Sunrise } from "./sunrise.svg";
import { ReactComponent as Sunset } from "./sunset.svg";
import styled from "styled-components";

const mapStateToProps = (state: AppState) => ({
  sun: state.app.sun
});

const Time = (props: { time: Date }) => <>{moment(props.time).format("LT")}</>;

const SpanBox = styled("span")`
  svg {
    stroke: ${({ theme }) => theme.backgroundColor};
    fill: ${({ theme }) => theme.defaultTextColor};
    vertical-align: text-bottom;
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const sun = (
  props: ReturnType<typeof mapStateToProps> & { className?: string }
) => (
  <SpanBox className={props.className}>
    <Sunrise />
    <Time time={props.sun.sunrise} /> - <Sunset />
    <Time time={props.sun.sunset} />
  </SpanBox>
);

export const Sun = connect(mapStateToProps)(sun);
