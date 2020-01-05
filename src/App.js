import React from 'react'

// 导入react-virtualized的样式
import 'react-virtualized/styles.css'

// 导入全局样式
import './App.css'

// 导入子组件
import Login from './views/Login'
import Layout from './views/Layout'
import Map from './views/Map'
import CityList from './views/CityList'
import HouseDetail from './views/HouseDetail'
import Rent from './views/Rent'
import RentAdd from './views/Rent/Add'
import RentSearch from './views/Rent/Search'
import NotFound from './views/NotFound'

import AuthRoute from './components/AuthRoute'

// 导入路由相关的核心概念
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div id="app">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/layout" component={Layout} />
          <Route path="/map" component={Map} />
          <Route path="/citylist" component={CityList} />
          <Route path="/detail/:id" component={HouseDetail} />

          {/* 以下是需要先通过权限校验的规则 */}
          <AuthRoute path="/rent" exact component={Rent} />
          <AuthRoute path="/rent/add" component={RentAdd} />
          <AuthRoute path="/rent/search" component={RentSearch} />

          {/* }
          <Route path="/rent/add" render={props => {
            if (isAuth()) {
              return <RentAdd {...props}/>
            } else {
              return <Redirect to={{pathname:'/login',state: {toWhere:props.location.pathname}}}/>
            }
          }}/>
          <Route path="/rent" render={props => {
            if (isAuth()) {
              return <Rent {...props}/>
            } else {
              return <Redirect to={{pathname:'/login',state: {toWhere:props.location.pathname}}}/>
            }
          }} />
          */}
          <Redirect exact from="/" to="/layout" />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  )
}

export default App
