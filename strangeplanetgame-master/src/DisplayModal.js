import React, { Component } from "react";
import "./Modal.css";
import logo from "./logo.png";
import $ from "jquery";

export class DisplayModal extends Component {
  constructor(props) {
    super(props);
  }

//   componentDidMount = () => {
//     document.addEventListener("click", this.handleClickOutside, true);
//   };

//   componentWillUnmount = () => {
//     document.removeEventListener("click", this.handleClickOutside, true);
//   };

//   handleClickOutside = event => {
//     const domNode = ReactDOM.findDOMNode(this.wrapperRef);

//     if (this.props.hidden === "show-modal" && !domNode.contains(event.target)) {
//         console.log(this.props.hidden)
//       //this.props.closeFunction();
//     }
//   };

  render() {
    return (
      <div
        id="main"
        className={this.props.hidden}
        ref={this.props.refer}
      >
        <div className="modal-content">
          <span
            className="close-button"
            onClick={() => this.props.closeFunction()}
          >
            &times;{" "}
          </span>
          <h2>{this.props.text}</h2>
        </div>
      </div>
    );
  }
}
