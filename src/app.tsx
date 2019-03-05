import * as React from "react";

import { Header } from "./header";
import { Main } from "./main";

export interface AppState {
    data: number[];
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class App extends React.Component<{}, AppState> {

    constructor(props: Readonly<AppState>) {
        super(props);

        this.state = { data: [1, 2, 3, 4, 5] }

        // setInterval(() => {
        //     const data = this.state.data;
        //     data.push(1);
        //     this.setState({ data });
        // }, 1000)

    }

    render() {
        return <div><Header /><Main /></div>;
    }
}