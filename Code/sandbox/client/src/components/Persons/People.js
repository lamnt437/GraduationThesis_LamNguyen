import React, { Component } from 'react';
import Person from './Person';

class People extends Component {
    render() {
        let number = this.props.number;
        return (
            <div>
                <p>Number: {number}</p>
                <Person name="Lam" age="30">
                    noi tang
                </Person>
            </div>
        )
    }
}

export default People;