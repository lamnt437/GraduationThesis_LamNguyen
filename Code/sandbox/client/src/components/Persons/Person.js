import React, { Component } from 'react';

const person = (props) => {
    return (
        <div>
            <p>I'm {props.name}!</p>
            <div>I'm {props.age}</div>
            <div>{props.children}</div>
        </div>
    )
}

export default person;