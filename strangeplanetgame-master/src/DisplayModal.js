import React from 'react';
import "./Modal.css"
import logo from './logo.png'
 


export class DisplayModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {text:"cb"};
    }
    
    render(){
        return (
        <div className= {this.props.hidden} >
            <div className="modal-content">
                <span className="close-button" >&times; </span>
                <h2>{this.props.text}</h2>
                
            </div>
        </div>
        )
    }

}