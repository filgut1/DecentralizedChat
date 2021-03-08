import React from 'react';
import {Component, useState} from "react";
import { Switch, Route } from 'react-router-dom';
import Conversation from './Conversation'

function randomColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}   

class Main extends Component {

    state = {
        messages: [
            {
            text: "This is a test message!",
            member: {
                color: "blue",
                username: this.props.userId
            }
            }
        ],
        member: {
            username: this.props.userId,
            color: randomColor()
        }
    }

    render() {
        return (
            <Switch> {/* The Switch decides which component to show based on the current URL.*/}
                <Route exact path='/' component={() => 
                    <Conversation 
                        messages={this.state.messages}
                        currentMember={this.state.member}
                    />
                }></Route>
            </Switch>
          );
    }
}

export default Main;