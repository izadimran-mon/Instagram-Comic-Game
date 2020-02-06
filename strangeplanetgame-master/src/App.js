import React from 'react';
import { AwesomeButton } from "react-awesome-button";
import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";
import './App.css';
import $ from 'jquery';
import  {DisplayModal}  from  './DisplayModal.js'
import logo from './logo.png'

var style = {
  backgroundColor: "#E700E7",
  borderTop: "2px solid #E7E7E7",
  textAlign: "center",
  // padding: "20px",
  topMargin: "100px",
  position: "fixed",
  left: "0",
  bottom: "0",
  height: "120px",
  width: "100%",
}

var phantom = {
display: 'block',
padding: '10px',
height: '20px',
width: '100%',
}
 
export default class App extends React.Component {


  constructor(props){
    super(props);
    this.state = {
      modalVisibility : "modal",
      result : '',
      currentCaption : "",
      counter : 0
    };
    this.toggleModal = this.toggleModal.bind(this);

  }

  componentDidMount() {
    var gcp = "http://35.184.2.171:8080/";
    var local = "http://localhost:8080/";
    $(document).ready(function(){
        $.getJSON(local, function(result){
            window.sessionStorage.setItem('data', JSON.stringify(result));
        });
      }
    )


  }

  toggleModal(){
    let visibility = this.state.modalVisibility === "modal" ? "show-modal" : "modal"
    this.setState({modalVisibility : visibility});
    console.log(this.state.modalVisibility)

  }

  render() {
    // var this.state.counter = 0;
    // var currentCaption;
    return (
      <div className="container">
        <img src={logo} alt='logo for the strange planet comics' className='cornerLogo'></img> 
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
                  $("#imageBox").attr("src", imageList[this.state.counter].media_url);
                  let currentCaption = imageList[this.state.counter].caption;
                  console.log(currentCaption);
                  this.setState({currentCaption : currentCaption});
                  this.state.counter ++;
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
              onPress={() => {
                let imageList = JSON.parse(window.sessionStorage.getItem('data'));
                if (imageList !== null) {
                  $("#imageBox").attr("src", imageList[imageList.length-1].media_url);
                  let currentCaption = imageList[imageList.length-1].caption;
                  this.setState({currentCaption : currentCaption});
                  console.log(currentCaption);
                  // create a random this.state.counter
                }
              }}
              >
                #IOTD
              </AwesomeButton>
              <AwesomeButton className='btn helpButton'
              size="small"
              type="primary"
              ripple
              onPress={() => {
                let result = "Welcome to the Strange Planet Guessing Game! \nClick on Random or Image of the Day (#IOTD) to get started.\
                              The caption is ONE of the words from the comic shown.\n Please enter your answer in the textbox without any spaces."
                this.toggleModal()
                setTimeout(()=>this.toggleModal(), 4000);

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
            onPress={() => {
              this.toggleModal()

              setTimeout(()=>this.toggleModal(), 1000);

              let userAnswer = document.getElementById('answer').value;
              if ( userAnswer !== null) {
                userAnswer = userAnswer.toString().toLowerCase();
                console.log("Your Answer: " + userAnswer);         
                console.log("Actual Answer: "  + this.state.currentCaption)
                if (userAnswer === this.state.currentCaption) {
                  console.log("yes");
                  let correctArr = ["c o r r e c t", "w o w", "g o o d  j o b", "p e r f e c t", "f l a w l e s s", "j o y  i n t e n s i f i e s", "s t r o n k s",
                  "You are a m a z i n g"]
                  let result = correctArr[Math.floor(Math.random() * correctArr.length)]
                  this.state.result = result;
                }
                else {
                  console.log("Wrong answer mate");
                  let correctArr = ["r e g r e t", "d i s a p p o i n t m e n t", "You get z e r o points", "d e c e p t i o n", "e w w", "t r y  a g a i n"]
                  let result = correctArr[Math.floor(Math.random() * correctArr.length)]
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

        <div>
          <div style={phantom} />
            <div style={style}>
              <p>
                <b>Disclaimer:</b> <br />
                All works seen on the website belongs to the brilliant <a href="https://www.instagram.com/nathanwpylestrangeplanet/?hl=en">Nathan W. Pyle</a>. <br />
                Minor edits have been made to certain images used so everything looks nice. <br />
                "Imagine Pleasant Nonsense"
              </p>
            </div>
          </div>
      </div>

    );  
  }
}


