import React from 'react';
import "./Modal.css"

export class DisplayModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {text:"cb"};
    }
    
    render(){
        return (
        <div className= {this.props.hidden} >
            <div className="modal-content">
                <span className="close-button" onClick="console.log">&times;</span>
                <h1>{this.props.text}</h1>
            </div>
        </div>
        )
    }

}