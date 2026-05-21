import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css"

import App from "./App.jsx";
import {HeroUIProvider} from "@heroui/system";
import axios from 'axios'
window.getBilibiliApi = () =>{
    var t = localStorage.getItem("bilibili-api");
    if ((t) && URL.canParse(t)) {
        return t
    } else {
        return "https://bili-api.ikun.dev"
    }
}
window.getAppBilibiliApi = () =>{
    var t = localStorage.getItem("app-bilibili-api");
    if ((t) && URL.canParse(t)) {
        return t
    } else {
        return "https://app-bili-api.ikun.dev"
    }
}
window.getMusicApi = () =>{
    var t = localStorage.getItem("music-api");
    if ((t) && URL.canParse(t)) {
        return t
    } else {
        return "https://music-api.ikun.dev/"
    }
}
window.getStreamProxy = () =>{
    var t = localStorage.getItem("stream-proxy");
    if ((t) && URL.canParse(t)) {
        return t
    } else {
        return "https://stream-proxy.ikun.dev/"
    }
}
/*
axios.interceptors.request.use(function (config) {
    var cookie = localStorage.getItem("cookie");
    if (cookie) {
        config.headers.set("Cookie", cookie);
    }
    return config;
}, function (error) {

    return Promise.reject(error);
});


 */
ReactDOM.createRoot(document.getElementById("root")).render(
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
,
);
