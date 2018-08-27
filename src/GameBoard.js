import React, { Component } from 'react';

class GameBoard extends Component {
	constructor(props) {
		super(props);

		this.generateLevel = this.generateLevel.bind(this);
		this.generateBoard = this.generateBoard.bind(this);
		this.generateGameObjs = this.generateGameObjs.bind(this);
		this.generateExit = this.generateExit.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this); 
		this.movePlayer = this.movePlayer.bind(this);
		this.checkValidMove = this.checkValidMove.bind(this);

		this.getRndInt = this.getRndInt.bind(this);
		

		this.state = {
			player : {
				name: "player",
				x: 2,
				y: 5
			},
			exit : {
				name: "exit",
				x: 8,
				y: 8
			},
			blocks : {},
			board : [],
		}
	}

	// Generates level and adds event listeners to the window
	componentDidMount(){
		this.generateLevel();

		window.addEventListener("keydown", this.handleKeyDown);
	}

	// Unmounts event listener incase this stops rendering
	componentWillUnmount(){
		window.removeEventListener("keydown", this.handleKeyDown);
	}

	// Helper method to get a random int
	getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
	}

	// Generates a new level
	generateLevel(){
		let newBoard = this.generateBoard();
		let newExit = this.generateExit(newBoard);
		let newBlocks = this.generateGameObjs(newBoard, "block", this.getRndInt(7, 30));
		this.generateGameObjs(newBoard, "collectable", this.getRndInt(7, 25));
		//generateRenderBoard();		//Function that makes a grid of components from the game objects

		this.setState({
			exit: newExit,
			blocks: newBlocks,
			board: newBoard,
		});
	}

	// Generates the preliminary game board
	generateBoard(){
		let x = this.props.cols;
		let y = this.props.rows;
		let board=[];
		
		if (!isNaN(x) && !isNaN(y)){
			for (let j = 0; j < y; j++){
				board[j] = [];
				for (let i = 0; i < x; i++){
					board[j][i] = [];
					if (this.state.player.x == i && this.state.player.y == j){
						board[j][i].push(this.state.player);
					}
				}
			}
		}

		return board;
	}

	// Generates the location for the exit
	generateExit(board){
		let maxX = this.props.cols;
		let maxY = this.props.rows;

		let x = this.getRndInt(0, maxX)
		let y = this.getRndInt(0, maxY)

		while (x === this.state.player.x && y === this.state.player.y){
			x = this.getRndInt(0, maxX)
			y = this.getRndInt(0, maxY)
		}

		let exit = {name:"exit", x: x, y: y};
		board[y][x].push(exit);
		return exit;
	}

	// Generates game objects in various locations on the board
	generateGameObjs(board, type, numberToSpawn){
		let maxX = this.props.cols;
		let maxY = this.props.rows;

		let objs = {};
		let numObjs = numberToSpawn;

		while (numObjs > 0){
			let x = this.getRndInt(0, maxX)
			let y = this.getRndInt(0, maxY)

			if (board[y][x].length === 0){
				let gammeObject = {
					name: type,
					x: x,
					y: y
				}
				if (objs[y] != null){
					if (objs[y].indexOf(x) === -1){
						objs[y].push(x);
						board[y][x].push(gammeObject);
						numObjs -= 1;
					}
				} else {
					objs[y] = [x];
					board[y][x].push(gammeObject);
					numObjs -= 1;
				}
			}
		}

		return objs;
	}

	// Handle's user keyboard inputs
	handleKeyDown(e){
		if (e.keyCode === 37) {							//Left
			this.movePlayer(this.state.player.x - 1, this.state.player.y);
		} else if (e.keyCode === 39){				//Right
			this.movePlayer(this.state.player.x + 1, this.state.player.y);
		} else if (e.keyCode === 38){				//UP
			this.movePlayer(this.state.player.x, this.state.player.y - 1);
		} else if (e.keyCode === 40){				//Down
			this.movePlayer(this.state.player.x, this.state.player.y + 1);
		}
	}

	// Move's the player to the specified location
	movePlayer(x, y){
		if (this.checkValidMove(x, y)) {
			let myBoard = this.state.board;
			let player = this.state.player;

			let playerSq = myBoard[player.y][player.x];
			let newPlayer = {name:player.name, x: x, y: y}
			myBoard[y][x].push(newPlayer)

			let playerIndex = playerSq.indexOf(player);
			if (playerIndex > -1) {
				playerSq.splice(playerIndex, 1);
			}
			
			this.setState({
				player: newPlayer,
				board : myBoard
			});
		}
	}

	// Checks to see if moving to this block is valid
	checkValidMove(x, y){
		if (x < 0 || y < 0 || x >= this.props.cols || y >= this.props.rows){
			return false;
		} 
		if (this.state.blocks[y] != null){
			if (this.state.blocks[y].indexOf(x) !== -1){
				return false;
			}
		}
		return true;
	}

	// Check collisions after the components 
	componentDidUpdate(prevProps) {
		this.checkCollision(this.state.player);
	}

	// Checks to see if the game object has collided with something
	checkCollision(gameObj){
		let curSq = this.state.board[gameObj.y][gameObj.x];
		if (curSq.length > 1){
			if (gameObj === this.state.player){
				if (gameObj.x === this.state.exit.x && gameObj.y === this.state.exit.y){
					this.props.addAir();
					this.generateLevel();
				}
				for (let otherObj of curSq) {
					if (otherObj.name === "collectable"){
						let otherObjIndex = curSq.indexOf(otherObj);
						curSq.splice(otherObjIndex, 1);
						this.props.addPoints(100);
						this.setState({
							board: this.state.board,
						})
					}
				}
			}
		}
	}

	// updateSquare(), only updates the square(s) we changed on the renderboard so the render function doesn't have to go through nested loops;

	// Turns game objects into react components
	objsToComponents(objList){
		let result = objList.map((obj) =>
			<GameObject key={obj.name + obj.x + " " + obj.y} gameObjType={obj.name}/>
		);

		return result;
	}

	render() {
		let gameRows = [];
		for (let j = 0; j < this.state.board.length; j++){
			let tiles = this.state.board[j].map((tile, index) =>
				<Tile key={index + " " + j}>{this.objsToComponents(tile)}</Tile>
			);
			gameRows.push(
				<div key={"row " + j} className = "game-row">{tiles}</div>
			);
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
			<div className="tile tile-empty">
				{this.props.children}
			</div>
		)
	}
}

class GameObject extends Component {

	render(){
		return(
			<div className={this.props.gameObjType}>
			</div>
		)
	}
}

export default GameBoard;
