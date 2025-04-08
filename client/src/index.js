import process from 'process';
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

window.process = process;

ReactDOM.render(<App />, document.getElementById("root"));
                                                                                                    