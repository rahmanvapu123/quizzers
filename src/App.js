import "./styles.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Main from "./main";
import Quiz from "./quiz";
import Admin from "./admin";
import React, { useEffect, useState } from "react";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Main />
        </Route>
        <Route exact path="/:id">
          <Quiz />
        </Route>
        <Route path="/admin/:id">
          <Admin />
        </Route>
      </Switch>
    </Router>
  );
}
