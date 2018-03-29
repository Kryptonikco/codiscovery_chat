import React from 'react';
import {
  BrowserRouter,
  Route
} from "react-router-dom";

import Home from "./scenes/Home";
import Rooms from "./scenes/Rooms";
import Room from "./scenes/Room";


class App extends React.Component {

  componentDidMount() {
  }

  render() {
    return (
      <BrowserRouter>
        <div className="container-fluid">
            <Route exact path='/' component={Home} />
            <Route exact path='/rooms/users/:userId' component={Rooms} />
            <Route exact path='/rooms/:id/users/:userId' component={Room} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
