import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Home from "./component/Home";

import Voting from "./component/Voting/Voting";
import Results from "./component/Results/Results";
import Registration from "./component/Registration/Registration";

import AddCandidate from "./component/Admin/AddCandidate/AddCandidate";
import Verification from "./component/Admin/Verification/Verification";
import test from "./component/test";

import Footer from "./component/Footer/Footer";

import "./App.css";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="header-accent"></div>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/AddCandidate" component={AddCandidate} />
            <Route exact path="/Voting" component={Voting} />
            <Route exact path="/Results" component={Results} />
            <Route exact path="/Registration" component={Registration} />
            <Route exact path="/Verification" component={Verification} />
            <Route exact path="/test" component={test} />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </Router>
        <Footer />
      </div>
    );
  }
}

class NotFound extends Component {
  render() {
    return (
      <div className="container-main">
        <div className="welcome-box">
          <h1>404 - Page Not Found</h1>
          <p className="welcome-subtitle">
            The page you are looking for doesn't exist. Please check the URL or navigate back to the home page.
          </p>
          <div className="welcome-actions">
            <Link to="/">
              <button>Return to Home</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
