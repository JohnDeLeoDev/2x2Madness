import React from 'react';
import './App.css';
import { layout } from './Layout.js';
import Model from './model/Model.js';
import { BOXSIZE, redrawCanvas } from './boundary/Boundary'; 
import {configs} from './model/Model';
import { rotateGroup, selectGroup } from './controller/Controller';
import {buttons} from './boundary/Boundary.js';
import rotateLeft from './assets/rotate.left.svg';
import rotateRight from './assets/rotate.right.svg';
import logo from './assets/logo.png';

var actualBoard = JSON.parse(JSON.stringify(configs));
 
function App() {
  const [model] = React.useState(new Model(actualBoard));
  const [redraw, forceRedraw] = React.useState(0);    
  const appRef = React.useRef(null);      
  const canvasRef = React.useRef(null);  
    
  React.useEffect(() => {
    redrawCanvas(model, canvasRef.current);
  }, [model, redraw]);

  const handleClick = (event) => {
    console.log(event.clientX, event.clientY, event.screenX, event.screenY);
    selectGroup(model.board, canvasRef.current, event, buttons);
    forceRedraw(redraw + 1);
  }  

  function configStyle(config) {
    if (model.config === config) {
      return layout.configButtonsSelected;
    } else {
      return layout.configButtons;
    }
  }

  return (
    <main style={layout.Appmain} ref={appRef}>
      <div style={layout.controlArea}>
        <button onClick= {() => {model.reset(model.config); forceRedraw(redraw+1);}} style={layout.resetButton}>Reset</button>
        <img style={layout.logo} src={logo} alt="logo"/>
        <div style={layout.configButtonArea}>
          <button onClick= {() => {model.setConfig(model.configs[0]); forceRedraw(redraw+1);}} style={configStyle(model.configs[0])}>Config 1</button>
          <button onClick= {() => {model.setConfig(model.configs[1]); forceRedraw(redraw+1);}} style={configStyle(model.configs[1])}>Config 2</button>
          <button onClick= {() => {model.setConfig(model.configs[2]); forceRedraw(redraw+1);}} style={configStyle(model.configs[2])}>Config 3</button>
        </div>
      </div>
      <div style={layout.victory}>{ model.victory() ? (<label data-testid="victory-label" style={layout.victory}>You Win!</label>) : null }</div>
      
      <label style={layout.text}>{"Number of moves: " + model.numMoves}</label>
      <div style={layout.canvasArea}>
        <canvas tabIndex="1"
          className="App-canvas"
          data-testid="canvas"
          ref ={canvasRef}
          width={BOXSIZE * model.numColumns + 10}
          height={BOXSIZE * model.numRows + 10}
          style={layout.canvas}
          onClick={handleClick}
        /> 
      </div>
      <div style={layout.rotateButtonsArea}>
          <button data-testid="counterclockwise" onClick={() => {rotateGroup(model, model.board, false); forceRedraw(redraw+1);}} style={layout.rotateButtons}>
            <img style={layout.rotateSVG} src={rotateLeft} alt="Rotate Counterclockwise"/>
          </button>
          <button data-testid="clockwise" onClick={() => {rotateGroup(model, model.board, true); forceRedraw(redraw+1);}} style={layout.rotateButtons}>
            <img style={layout.rotateSVG} src={rotateRight} alt="Rotate Clockwise"/>
          </button>
      </div>
      <div>
        <a style={layout.brand} href="https://johndeleo.dev">JohnDeLeo.dev</a>
      </div>
      
    </main>

  );
}
export default App;
