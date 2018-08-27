import React, { Component } from 'react';
import UserInterface from './UserInterface';
import GameBoard from './GameBoard';
//import logo from './logo.svg';
import './css/main.css';

class App extends Component {
  constructor(props ){
    super(props);

    this.state = {
      isPlaying: false,
      playerLife: 3,
    }
  }

  render() {
    return(
      <div id="page">
        <h1>Minesweeper <i className="far fa-smile-wink"></i></h1>
        <div id="gameApp">
          <UserInterface 
            isPlaying = {this.state.isPlaying}
            playerLife = {this.state.playerLife} 
          />
          <GameBoard 
            isPlaying = {this.state.isPlaying}
            rows = "10"
            cols = "10"
          />
        </div>
      </div>
    );
  }
}


export default App;
