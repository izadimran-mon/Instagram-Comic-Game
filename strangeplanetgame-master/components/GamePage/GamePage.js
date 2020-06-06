import React from 'react';
import PropTypes from 'prop-types';
import styles from './GamePage.module.css';
import React from "react";
import ReactDOM from "react-dom";
import { AwesomeButton } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss"; //need this
import "./App.css";
import $ from "jquery";
import { DisplayModal } from "./DisplayModal.js";
import logo from "./logo.png";


var phantom = {
	display: "block",
	padding: "10px",
	height: "20px",
	width: "100%"
};

export default class GamePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisibility: "modal",
			result: "",
			currentCaption: "",
			counter: 0,
			imageList: JSON.parse(window.sessionStorage.getItem("data")),
			start: false
		};
		this.toggleModal = this.toggleModal.bind(this);
		this.closeFunction = this.closeFunction.bind(this);
		this.inputRef = React.createRef();
		this.modalRef = React.createRef();
	}

	toggleModal() {
		let visibility = "show-modal";
		this.setState({ modalVisibility: visibility });
		console.log("visibility " + this.state.modalVisibility);
	}

	closeFunction() {
		this.setState({ modalVisibility: "modal" });
	}

	setModalRef = node => {
		this.modalRef = node;
	};

	handleClickOutside = event => {
		const domNode = ReactDOM.findDOMNode(this.modalRef);

		if (!domNode || !domNode.contains(event.target)) {
			this.closeFunction();
		}
		document.removeEventListener("click", this.handleClickOutside);
		document.removeEventListener("ontouchend", this.handleClickOutside);
	};

	handleKeyPress(target) {
		if (target.charCode == 13) {
			alert("Enter clicked!!!");
		}
	}

	render() {
		const modalVisible = this.state.modalVisibility === "modal" ? false : true;
		return (
			<div className="fill-window">
				<div className="centerImgContainer">
					<img id="imageBox" src={logo} className="centerImage comic"></img>

					{/* 3 column table */}
					<div className="btnContainer">
						<div className="row row-1">
							<AwesomeButton
								className="btn randomButton leftmost"
								type="primary"
								size="medium"
								ripple
								disabled={modalVisible}
								onPress={() => {
									if (this.state.imageList !== null) {
										this.state.counter = Math.floor(
											Math.random() * this.state.imageList.length
										);

										$("#imageBox").attr(
											"src",
											this.state.imageList[this.state.counter].media_url
										);
										let currentCaption = this.state.imageList[
											this.state.counter
										].caption;
										console.log(currentCaption);
										this.setState({ currentCaption: currentCaption });
									}
								}}
							>
								Random
              </AwesomeButton>

							<AwesomeButton
								className={`btn iotdButton`}
								size="medium"
								type="secondary"
								ripple
								disabled={modalVisible}
								// onPress={() => handleIOTDButton()}
								onPress={() => {
									// let imageList = JSON.parse(window.sessionStorage.getItem('data'));
									if (this.state.imageList !== null) {
										$("#imageBox").attr(
											"src",
											this.state.imageList[this.state.imageList.length - 1]
												.media_url
										);
										let currentCaption = this.state.imageList[
											this.state.imageList.length - 1
										].caption;
										this.setState({ currentCaption: currentCaption });
										console.log(currentCaption);
										// create a random this.state.counter
									}
								}}
							>
								#IOTD
              </AwesomeButton>

							<AwesomeButton
								className={`btn helpButton`}
								size="small"
								type="primary"
								ripple
								disabled={modalVisible}
								onPress={() => {
									let result =
										"Welcome to the Strange Planet Guessing Game! \nClick on Random or Image of the Day (#IOTD) to get started.\
															The caption is ONE of the words from the comic shown.\n Please enter your answer in the textbox without any spaces.";
									this.toggleModal();
									// setTimeout(()=>this.toggleModal(), 4000);

									this.state.result = result;

									//listen to click event outside of modal
									setTimeout(() => {
										document.addEventListener("click", this.handleClickOutside);
										document.addEventListener(
											"ontouchend",
											this.handleClickOutside
										);
									}, 500);
								}}
							>
								{/* //handleHelpButton()} */}
                Help
              </AwesomeButton>
						</div>
					</div>

					{/* answer form */}
					<div className="row row-2">
						<input
							className="textBox leftmost"
							type="text"
							name="Answer"
							id="answer"
							placeholder="Answer"
							onKeyPress={this.handleKeyPress}
							disabled={modalVisible}
							ref={el => {
								this.inputRef = el;
							}}
						></input>

						<AwesomeButton
							className={`btn submitButton`}
							type="secondary"
							size="small"
							ripple
							disabled={modalVisible}
							onPress={() => {
								this.toggleModal();

								let userAnswer = document.getElementById("answer").value;
								if (userAnswer !== null) {
									userAnswer = userAnswer.toString().toLowerCase();
									console.log("Your Answer: " + userAnswer);
									console.log("Actual Answer: " + this.state.currentCaption);
									if (userAnswer === this.state.currentCaption) {
										console.log("yes");
										let correctArr = [
											"c o r r e c t",
											"w o w",
											"g o o d  j o b",
											"p e r f e c t",
											"f l a w l e s s",
											"j o y  i n t e n s i f i e s",
											"s t r o n k s",
											"You are a m a z i n g"
										];
										let result =
											correctArr[Math.floor(Math.random() * correctArr.length)];
										this.state.result = result;
										document.getElementById('answer').value = "";
									} else {
										console.log("Wrong answer mate");
										let correctArr = [
											"r e g r e t",
											"d i s a p p o i n t m e n t",
											"You get z e r o points",
											"d e c e p t i o n",
											"e w w",
											"t r y  a g a i n"
										];
										let result =
											correctArr[Math.floor(Math.random() * correctArr.length)];
										this.state.result = result;
										document.getElementById('answer').value = "";
									}
								}
								//listen to click event outside of modal
								setTimeout(() => {
									document.addEventListener("click", this.handleClickOutside);
									document.addEventListener(
										"ontouchend",
										this.handleClickOutside
									);
								}, 500);
							}}
						>
							Submit
            </AwesomeButton>
					</div>
				</div>

				{/* results form */}
				<div className="row row-2">
					<DisplayModal
						
						hidden={this.state.modalVisibility}
						text={this.state.result}
						closeFunction={this.closeFunction}
						refer={this.setModalRef}
					/>
				</div>

				<div className="container">
					<div style={phantom} />
					<div className="disclaimer">
						<p>
							<b>Disclaimer:</b> <br />
              All works seen on the website belongs to the brilliant{" "}
							<a href="https://www.instagram.com/nathanwpylestrangeplanet/?hl=en">
								Nathan W. Pyle
              </a>
              . <br />
              Minor edits have been made to certain images used so everything
              looks nice. <br />
							<b>"Imagine Pleasant Nonsense"</b>
						</p>
					</div>
				</div>
			</div>
		);
	}
}
