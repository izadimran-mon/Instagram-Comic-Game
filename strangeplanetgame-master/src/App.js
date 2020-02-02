import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";
import './App.css';
import $ from 'jquery';

export default class App extends React.Component {
  componentDidMount() {
    var gcp = "http://104.198.169.162:8080/";
    var local = "http://localhost:8080/";
    $(document).ready(function(){
        $.getJSON(local, function(result){
            window.sessionStorage.setItem('data', JSON.stringify(result));
        });
      })
  }

  handleSubmitButton() {
    console.log("Submit");
  }
  
  handleRandomButton() {}
  
  handleIOTDButton() {
    console.log("#IOTD");
  }
  
  handleHelpButton() {
    console.log("Help");
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
              type="secondary"
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
              // onPress={() => handleIOTDButton()}
              >
                #IOTD
              </AwesomeButton>
              <AwesomeButton className='btn helpButton'
              size="medium"
              type="secondary"
              ripple
              // onPress={() => handleHelpButton()}
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
            onPress={() => {
              let userAnswer = document.getElementById('answer').value;
              if ( userAnswer !== null) {
                userAnswer.toString().toLowerCase();
                console.log(userAnswer);              
                if (userAnswer == currentCaption) {
                  console.log("yes");
                }
                else {
                  console.log("Wrong answer mate");
                }
              }
            }}
            >
              Submit
            </AwesomeButton>
          </div>
        </div>
        
      </div>
    );  
  }
}


