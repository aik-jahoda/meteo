import * as React from "react";

import { Header } from "./header";
import { Main } from "./main";

export interface AppState { }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class App extends React.Component<{}, AppState> {
    render() {
        return [<Header/>, <Main/>];
    }
}