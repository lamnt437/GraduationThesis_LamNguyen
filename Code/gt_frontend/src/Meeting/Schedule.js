import React, { Component } from 'react';
import axios from 'axios';

class Schedule extends Component {
    state = {

    };

    postDataHandler() {
        console.log("Scheduled!");
    }

    render() {
        // add logic to send post request using axios
        return (
            <div>
                <button onClick={this.postDataHandler}>Schedule Meeting</button>
            </div>
        );
    }
}

export default Schedule;