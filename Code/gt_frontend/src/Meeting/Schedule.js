import React, { Component } from 'react';
import axios from 'axios';

class Schedule extends Component {
    state = {
        startUrl: "hello",
        joinUrl: "",
        error: "",
        click: false
    };

    scheduleHandler = () => {
        console.log("clicked!")
        axios.get('https://zoomclass2021.herokuapp.com/meeting/create').then(response => {
            console.log(response)
            this.setState({
                startUrl: response.data.start_url
            });
        }).catch(error => {
            this.setState({
                error: error
            })
        })
    }

    setStateHandler = () => {
        console.log("set state clicked!")
        this.setState({
            startUrl: "hello, world"
        });
    }

    render() {
        // add logic to send post request using axios
        return (
            <div>
                <button onClick={this.scheduleHandler}>Schedule Meeting</button>
                <button onClick={this.setStateHandler}>Set State</button>
                <p>Url: {this.state.startUrl}</p>
                <p>Error: {this.state.error}</p>
                <p>{this.state.click}</p>
            </div>

        );
    }
}

export default Schedule;