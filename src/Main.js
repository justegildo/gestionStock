import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './App';
import Login from './Login';
import Splash from './Splash';

function Main(props) {

    return (
        <Switch>
            <Route path="/login" component={Login} />
            <Route path="/redirectLogin/:state" component={Login} />
            <Route path="/" exact component={Splash} />
            <Route path="*" component={App} />
        </Switch>
    );
}

export default Main;
