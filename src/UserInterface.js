import React, { Component } from 'react';

class UserInterface extends Component {
	render() {
		return(
			<div id="user-interface-row">
				<LifeUI playerLife = {this.props.playerLife}/>
				<div id="smiley-ui">
					<button type="button">:)</button>
				</div>
				<TimerUI />
			</div>
		);
	}
}

class LifeUI extends Component {

	render() {
		return(
			<div id="life-ui">
				{this.props.playerLife}
			</div>
		);
	}
}

class TimerUI extends Component {
	constructor(props) {
		super(props);

		this.state = {
			time: 0,
		}
	}

	componentDidMount() {
		this.timer = setInterval(
			() => this.tick(),
			1000
		);
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	tick() {
		this.setState({
			time: parseInt(this.state.time, 10) + 1
		});
	}

	render() {
		return(
			<div id="timer-ui">
				{this.state.time}
			</div>
		)
	}
}
  
export default UserInterface;