import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';

export default class App extends Component {
  state = { username: "some text here" };

  render() {
    const { username } = this.state;
    return (
      <div>
      <p> some text here again </p>
        {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loadingdsdsdsdsds.. please wait!</h1>}
        <img src={ReactImage} alt="react" />
      </div>
    );
  }
}