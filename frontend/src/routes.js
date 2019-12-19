import React from 'react'
import {HashRouter, Route, Switch} from 'react-router-dom'
import Main from './containers/Main'
import ScrollToTop from './components/ScrollTop'
import Locations from "./containers/Locations";

export default () => (
    <HashRouter>
        <ScrollToTop>
            <Switch>
                <Route exact path='/' component={Main}/>
                <Route exact path='/locations' component={Locations}/>
            </Switch>
        </ScrollToTop>
    </HashRouter>
)
