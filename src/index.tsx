import React from "react";
import ReactDOM from "react-dom";

import { App } from "./app"
import { ErrorBoundary } from "./errorBoundary";

function start() {

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () { console.log('Service Worker Registered'); });
    }

    const app = document.getElementById("app");
    if (!app) {
        throw "Element with id 'app' not found."
    }

    ReactDOM.render((<ErrorBoundary><App /></ErrorBoundary>), app);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => start());
} else {
    start()
}

