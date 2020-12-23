import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// class Square extends React.Component {
//   render() {
//     return (
//       //타이핑 횟수 줄이고, this의 혼란을 피하기 위해 화살표 함수 사용
//       //square를 클릭할 때 현재 state 표시해줌 : 버튼 클릭할때마다 다시 렌더링
//        <button 
//         className="square" 
//          onClick={() =>  this.props.onClick()}
//          > 
//          {this.props.value}  
//       </button>
//       //부모 board 컴포넌트 -> 자식 square 컴포넌트로 value와 onClick 두개의 prop 전달함
//     );
//   }
// }


function Square(props){
  return (
    <button className="square" onClick={props.onClick}>
         {props.value}  
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  } //square에 value prop을 전달하기 위해 코드 수정

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

//square -> board -> game (최상위)
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state={
      history: [
        {
        squares: Array(9).fill(null),
        }
      ],
      stepNumber: 0,
      xisNext:true,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculrateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xInNext ? 'X':'O';
    this.setState({
      history: history.concat([
        {
        squares: squares,
        }
      ]),
      stepNumber: history.length,
      xInNext: !this.state.xInNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculrateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
  
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculrateWinner(squares){
  const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
for (let i = 0; i < lines.length; i++) {
  const [a, b, c] = lines[i];
  if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    return squares[a];
  }
}
return null;
}