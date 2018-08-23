import React, { Component } from 'react';
import '../styles/App.css';
import Chatbot from './Chatbot';

const CONTRIBUTEURL =  "https://docs.google.com/spreadsheets/d/1Q6ksxv_JRXVJAQ8T5mebS1lF87wJla7swKLhh6znHhg/edit?usp=sharing"

class App extends Component {
  render() {
    return (
      <div className="app">
        <div className="page-border">
          <div className="header">
            <div className="header-content">
              <h2 className="title">watbot.io</h2>
              <a href={CONTRIBUTEURL} target="_blank" rel="noopener noreferrer"><button className="boxy">contribute</button></a>
            </div>
          </div>
          <Chatbot />
        </div>
      </div>
    )
  }
}

export default App;
