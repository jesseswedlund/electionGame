import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Home from "./Home";
import NotFound from "./NotFound";

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <div id="homeLink">
            <Link className="navLink" to="/">
              2020 Presidential Election - the Race to 270 Electoral Votes
            </Link>
          </div>
        </nav>
        <main>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;
