import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';

import { login } from './AppActions';
import { PLAYING, ENDED } from './game/GameConstants';
import { startGame, updateSoundStatus, updateInstructionsStatus } from './game/GameActions';
import { updateCodeEditorStatus } from './codeeditor/CodeEditorActions';

import Game from './game/Game';
import SoundOption from './game/soundoption/SoundOption';
import Instructions from './game/instructions/Instructions';
import CodeEditor from './codeeditor/CodeEditor';

import Conditional from './helpers/Conditional';

const mapStateToProps = (state) => {
  return {
    gameState: state.game.gameState,
    user: state.app.user,
    soundEnabled: state.game.soundEnabled,
    codeEditorOpen: state.code.codeEditorOpen,
    instructionsOpen: state.game.instructionsOpen
  };
};

const mapDispatchToProps = {
  login,
  startGame, 
  updateSoundStatus,
  updateCodeEditorStatus,
  updateInstructionsStatus
};

class App extends Component {
  componentDidMount() {
    const { login } = this.props;

    this.getUserDetails()
      .then((res) => {
        login(res);

        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getUserDetails() {
    const response = await fetch('/user');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  }

  toggleSound() {
    const { updateSoundStatus, soundEnabled } = this.props;

    updateSoundStatus(!soundEnabled);
  }

  closeCodeEditor() {
    const { updateCodeEditorStatus } = this.props;

    updateCodeEditorStatus(false);
  }

  closeInstructions() {
    const { updateInstructionsStatus } = this.props;

    updateInstructionsStatus(false);
  }

  render() {
    const { gameState, soundEnabled, codeEditorOpen, user, instructionsOpen } = this.props;
    return (
      <div className="app">
        <div className="app__header">
          <div className="app_column text-left">
            <Conditional if={!user.FirstName}>
              <Conditional if={gameState === PLAYING}>
                <div className="google__button--disabled"></div>
              </Conditional>
              
              <Conditional if={gameState !== PLAYING}>
                <a href="http://localhost:5000/auth/google"><div className="google__button"></div></a>
              </Conditional>
            </Conditional>
          </div>
          <div className="app_column text-right">
            <SoundOption enabled={soundEnabled}
                          onClickHandler={this.toggleSound.bind(this)}
                          blocked={gameState === PLAYING} />
          </div>
        </div>

        <span className="app__name">Audio Cues</span>

        <Conditional if={gameState !== ENDED}>
          <p className="app__instructions">Goal: Find the box with the hidden item.</p>
        </Conditional>

        <Game></Game>

        <Conditional if={codeEditorOpen && gameState !== PLAYING}>
          <CodeEditor closeHandler={this.closeCodeEditor.bind(this)}></CodeEditor>
        </Conditional>

        <Conditional if={instructionsOpen && gameState !== PLAYING}>
          <Instructions closeHandler={this.closeInstructions.bind(this)}></Instructions>
        </Conditional>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
