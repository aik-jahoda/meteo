import * as React from "react";

interface ErrorBoundaryState {
    hasError:boolean;
}

export class ErrorBoundary extends React.Component<{},ErrorBoundaryState> {
    constructor(props:Readonly<{}> ) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(_error: Error | null) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error: Error | null, info: object) {
      // You can also log the error to an error reporting service
      console.log("Error occured in the app:", error, info);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong.</h1>;
      }
  
      return this.props.children; 
    }
  }