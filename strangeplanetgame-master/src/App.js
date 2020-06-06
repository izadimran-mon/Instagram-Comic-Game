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

export default class App extends React.Component {
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

	componentDidMount() {
		var that = this;
		var gcp = "http://35.184.2.171:8080/";
		var local = "http://localhost:8080/";
		var firebase_hosted =
			"https://us-central1-instagram-comic-game.cloudfunctions.net/app";
		$(document).ready(function () {
			$.ajax({
				url: firebase_hosted,
				type: 'GET',
				tryCount: 0,
				retryLimit: 10,
				success: function (json) {
					// console.log(json);
					window.sessionStorage.setItem("data", JSON.stringify(json));
					that.setState({
						imageList: JSON.parse(window.sessionStorage.getItem("data"))
					});
				},
				error: function (xhr, textStatus, errorThrown) {
					if (textStatus == "timeout") {
						this.tryCount++;
						if (this.tryCount <= this.retryLimit) {
							//try again
							$.ajax(this);
							return;
						}
						return;
					}
					if (xhr.status == 500) {
						//handle error
						this.tryCount++;
						if (this.tryCount <= this.retryLimit) {
							//try again
							$.ajax(this);
							return;
						}
						return;
						// } else {
						//     //handle error
					}
				}
			});
		});
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

	render() {
		const modalVisible = this.state.modalVisibility === "modal" ? false : true;

		return (
			<div className="fill-window">
				<div className="centerImgContainer">
					<img id="imageBox" src={logo} className="centerImage comic"></img>
				
					<div className="btnContainer">
						<div className="row-1">
							<AwesomeButton
								className="btn randomButton"
								type="primary"
								size="medium"
								ripple
								disabled={false}
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
								Start
							</AwesomeButton>
						</div>
						
						<div className="row-2">
							<AwesomeButton
							className="btn helpButton center"
							size="small"
							type="primary"
							ripple
							disabled={false}
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
								Help
							</AwesomeButton>
						</div>
					</div>
					
				</div>

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
