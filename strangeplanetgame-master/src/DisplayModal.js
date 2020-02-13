import React from 'react';
import "./Modal.css"
import logo from './logo.png'
import $ from 'jquery';



export class DisplayModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {closeFunction : () => {
            this.setState({hidden : 'modal'})
        }
        ,
        hidden : this.props.hidden
    };

    }
    
    render(){
        return (
        <div id="main" className= {this.props.hidden} >
            <div className="modal-content">
                <span className="close-button" onClick={this.props.closeFunction}>&times; </span>
                <h2>{this.props.text}</h2>
                
            </div>
        </div>
        )
    }

}