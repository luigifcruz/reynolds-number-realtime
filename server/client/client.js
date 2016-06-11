import React from 'react'
import { render } from 'react-dom'
import App from '../components/App'
import Loading from '../components/Loading'
import Realtime from '../components/Realtime'
import { Router, Route, browserHistory, Redirect } from 'react-router'

render((
  <Router history={browserHistory}>
    <Route path="app" component={App}>
      <Route path="loading" component={Loading}/>
      <Route path="realtime" component={Realtime}/>
    </Route>
  </Router>
), document.getElementById('app'));
