// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Spinner } from 'amis'
import { HashRouter as Router,Redirect, Switch, Route, Link } from 'react-router-dom'
import { Provider, rootStore } from './store/root'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all'
import 'amis/lib/themes/default.css'
import 'amis/lib/themes/cxd.css'
import 'amis/lib/helper.css'
import 'amis/sdk/iconfont.css'
import 'amis-editor-core/lib/style.css'
import './App.css'

const Preview = React.lazy(() => import('./components/preview/Preview'))
const MyEditor = React.lazy(() => import('./components/MyEditor'))
const Element = React.lazy(() => import('./components/vue'))
const App = () => {
  return (
    <Provider value={rootStore}>
      <Router>
        <React.Suspense fallback={<Spinner  className="m-t-lg" size="lg" />}>
          <Switch>
            {/* <Redirect to="/preview" >
              
            </Redirect> */}
            <Route path="/preview">
              <Preview />
            </Route>
            <Route path="/element">
              <Element />
            </Route>
            <Route path="/MyEditor/:id">
              <MyEditor theme={'cxd'} />
            </Route>
          </Switch>
        </React.Suspense>
      </Router>
    </Provider>
  )
}

export default App
