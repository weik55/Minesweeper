import React, { Component } from 'react';

class GameBoard extends Component {
	constructor(props) {
		super(props);

		this.generateBoard = this.generateBoard.bind(this);

		this.state = {
			board : this.generateBoard(this.props.rows, this.props.cols)
		}
	}

	componentDidMount(){
		//this.setState({
		//	board: this.generateBoard(this.props.rows, this.props.cols)
		//});
	}
	
	generateBoard(rows, cols){
		let board=[];
		let x = parseInt(rows, 10);
		let y = parseInt(cols, 10);

		if (!isNaN(x) && !isNaN(y)){
			
			for (let j = 0; j < y; j++){
				board[j] = [];
				for (let i = 0; i < x; i++){
					board[j][i] = <Tile key={i + " " + j} x={i} y={j} />;
				}
			}
		}

		return board;
	}

	render() {

		let gameRows = [];
		for (let j = 0; j < this.state.board.length; j++){
			gameRows.push(<div key={"row " + j} className = "game-row">{this.state.board[j]}</div>);
		}

		return(
			<div id="game-board">
				{gameRows}
			</div>
		);
	}
}

class Tile extends Component {

	render() {

		return(
			<div className="tile">

			</div>
		)
	}
}

export default GameBoard;
