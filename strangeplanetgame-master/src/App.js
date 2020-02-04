import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";
import './App.css';
import $ from 'jquery';
import  {DisplayModal}  from  './DisplayModal.js'

export default class App extends React.Component {


  constructor(props){
    super(props);
    this.state = {
      modalVisibility : "modal",
      result : ''
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {
    var gcp = "http://104.198.169.162:8080/";
    var local = "http://localhost:8080/";
    $(document).ready(function(){
        $.getJSON(local, function(result){
            window.sessionStorage.setItem('data', JSON.stringify(result));
        });
      })
  }

  toggleModal(){
    let visibility = this.state.modalVisibility === "modal" ? "show-modal" : "modal"

    this.setState({modalVisibility : visibility});
    console.log(this.state.modalVisibility)

  }

  render() {
    var counter = 0;
    var currentCaption;
    return (
      <div className="container">
        <div className="centerImgContainer">
          <img id="imageBox" className='centerImage comic'></img> 
          <div className="btnContainer">
            <div className="row row-1">
              <AwesomeButton className='btn randomButton leftmost'
              type="primary"
              size="medium"
              ripple
              onPress={() => {
                let imageList = JSON.parse(window.sessionStorage.getItem('data'));
                if (imageList !== null) {
                  $("#imageBox").attr("src", imageList[counter].media_url);
                  currentCaption = imageList[counter].caption;
                  console.log(currentCaption);
                  counter ++;
                }
              }}
              >
                Random
              </AwesomeButton>
              <AwesomeButton className='btn iotdButton'
              size="medium"
              type="secondary"
              ripple
              onPress={() => handleIOTDButton()}
              >
                #IOTD
              </AwesomeButton>
              <AwesomeButton className='btn helpButton'
              size="small"
              type="primary"
              ripple
              onPress={() => {
                let result = "HELP LA"
                this.toggleModal()
                this.state.result = result;

              }}//handleHelpButton()}
              >
                Help
              </AwesomeButton>
            </div>
          </div>
          <div className="row row-2">
            <input id="answer" className="textBox leftmost" type="text" name="Answer" placeholder="Answer"></input>
            <AwesomeButton className='btn submitButton'
            type="secondary"
            size="small"
            ripple
            // onPress={() => handleSubmitButton()}
            onPress={() => {
              this.toggleModal()
              let userAnswer = document.getElementById('answer').value;
              if ( userAnswer !== null) {
                userAnswer = userAnswer.toString().toLowerCase();
                console.log(userAnswer);         
                currentCaption = "faster"     
                if (userAnswer == currentCaption) {
                  console.log("yes");
                  let result = "Correct"
                  this.state.result = result;
                }
                else {
                  console.log("Wrong answer mate");
                  let result = "Wrong GAO GAO"
                  this.state.result = result;

                }
              }
            }}
            >
              Submit
            </AwesomeButton>
          </div>
        </div>
        <div className="row row-2">
          <DisplayModal hidden={this.state.modalVisibility} text={this.state.result} />
        </div>
      </div>

    );  
  }
}

const handleSubmitButton = () => {
  console.log("Submit");
}

const handleRandomButton = () => {
  console.log("Random");
}

const handleIOTDButton = () => {
  console.log("#IOTD");
}

const handleHelpButton = () => {
  console.log("Help");
}
