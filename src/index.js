import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button 
            className="square"
            onClick={props.onClick}
        >
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
        )
    }

    render() {
        let rows = [];
        for (let i = 0; i < 3; i++) {
            let squares = [];
            for (let j = 0; j < 3; j++) {
                squares.push(this.renderSquare(i * 3 + j));
            }
            rows.push(
                <div className="board-row">
                    {squares}
                </div>
            );
        }

        return (
            <div>
                {rows}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                prevSquare: null,
            }],
            stepNumber: 0,
            selectedStep: 0,
            xIsNext:true,
        }
    }
    
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([{
                squares: squares,
                prevSquare: i,
            }]),
            stepNumber: history.length,
            selectedStep: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            selectedStep: step,
            xIsNext: (step %2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        
        const moves = history.map((step, move) => {
            const desc = move ?
                "Перейти к ходу №" + move :
                "К началу игры";
            const selected = this.state.selectedStep === move;
            const prevSquare = move ?
                `${Math.floor(history[move].prevSquare / 3) + 1}, ${(history[move].prevSquare % 3) + 1} ` :
                "";
            return(
                <li key={move}>
                    {prevSquare}
                    <button class={selected ? "selected" : ""} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        
        let status;
        if (winner) {
            status = "Выиграл " + winner;
        } else if (this.state.selectedStep < 9) {
            status = "Следующий ход: " + (this.state.xIsNext ? "X" : "O");
        } else {
            status = "Ничья"
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

function calculateWinner(squares) {
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