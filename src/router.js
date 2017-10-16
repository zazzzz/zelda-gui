import React from 'react';
import { Router, Route, Switch } from 'dva/router';

import Home from 'routes/Home';

import Zelda from 'routes/Zelda';

import Status from 'routes/Status';

import Operate from 'routes/Operate';

import Project from 'routes/Project';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/zelda" exact component={Zelda} />
        <Route path="/status" exact component={Status} />
        <Route path="/operate" exact component={Operate} />
        <Route path="/project" exact component={Project} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
