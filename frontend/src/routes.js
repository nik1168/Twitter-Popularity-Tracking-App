import React from 'react'
import {Route, HashRouter, Switch} from 'react-router-dom'
import Main from './containers/Main'
import {Provider} from 'react-redux'
import ScrollToTop from './components/ScrollTop'
import TheoreticalAnalysis from "./containers/TheoreticalAnalysis";
import Demo from "./containers/Demo";
import Locations from "./containers/Locations";

export default ({store}) => (
    <Provider store={store}>
        <HashRouter>
            <ScrollToTop>
                <Switch>
                    <Route exact path='/' component={Main}/>
                    <Route exact path='/locations' component={Locations}/>
                </Switch>
            </ScrollToTop>
        </HashRouter>
    </Provider>
)
