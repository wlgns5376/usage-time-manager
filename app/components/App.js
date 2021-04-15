import React, { Component } from 'react';
import { HashRouter as Router, Route, NavLink, Switch } from 'react-router-dom';
import Home from './Home';
import Sales from './Sales';
import logo from '../images/logo.png';

class App extends Component {

  render() {

    return (
    <Router>
      <div className="App">
        <header className="App-header navbar navbar-dark navbar-expand bg-dark fixed-top">
            <div className="navbar-brand mr-0 mr-md-5">
                <img src={logo} width="30" className="d-inline-block align-top mr-1" />
                쉼클라이밍
                <small className="pl-1">v{this.props.version}</small>
            </div>
            <div>
                <nav className="navbar-nav flex-row">
                    <NavLink exact className="nav-item nav-link" activeClassName="active" to="/">이용현황</NavLink>
                    <NavLink className="nav-item nav-link" activeClassName="active" to="/sales">매출내역</NavLink>
                </nav>
            </div>
            <div className="window-title-buttons ml-md-auto">
                <button type="button" className="btn btn-sm btn-window-minimize px-3 mr-1" onClick={this.props.minimize}><i className="fa fa-window-minimize"></i></button>
                <button type="button" className="btn btn-sm btn-window-maximize px-3 mr-1" onClick={this.props.maximize}><i className="fa fa-window-maximize"></i></button>
                <button type="button" className="btn btn-sm btn-window-close px-3" onClick={this.props.close}><i className="fa fa-times"></i></button>
            </div>
        </header>
        <div className="App-body container-fluid">
            <div className="row">
                <div className="col-12 col-md-12 col-xl-12 pt-3">
                    <Switch>
                        <Route exact path="/" render={(props) => <Home {...props} db={this.props.db} />} />
                        <Route path="/sales" render={(props) => <Sales {...props} db={this.props.db} />} />
                    </Switch>
                </div>
            </div>
        </div>
      </div>
    </Router>
    );
  }
}

export default App;
