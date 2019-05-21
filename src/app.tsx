import * as moment from "moment";
import * as React from "react";
import {
  createGlobalStyle,
  DefaultTheme,
  ThemeProvider
} from "styled-components";
import { Header } from "./Header";
import { Main } from "./Main";
import NotoColorEmoji from "./NotoColorEmoji.ttf";

export interface AppState {
  data: number[];
}

const theme: DefaultTheme = {
  backgroundColor: "black",
  backgroundContrastColor: "grey",
  defaultTextColor: "white"
};

declare module "styled-components" {
  interface DefaultTheme {
    backgroundColor: string;
    defaultTextColor: string;
    backgroundContrastColor: string;
  }
}

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.backgroundColor};
    color: ${({ theme }) => theme.defaultTextColor}
  }

  @font-face {
    font-family: Noto Emoji;
    src: url(${NotoColorEmoji}) format("truetype");
  }
   
  svg text {
    fill: ${({ theme }) => theme.defaultTextColor}
  }
`;

//const locale = window.navigator.language;
moment.locale("cs");
// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export default class App extends React.Component<{}, AppState> {
  constructor(props: Readonly<AppState>) {
    super(props);

    this.state = { data: [1, 2, 3, 4, 5] };

    // setInterval(() => {
    //     const data = this.state.data;
    //     data.push(1);
    //     this.setState({ data });
    // }, 1000)
  }

  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <>
            <GlobalStyle />
            <Header />
            <Main />
          </>
        </ThemeProvider>
      </div>
    );
  }
}
