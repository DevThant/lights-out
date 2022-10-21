import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    lightsOn: 0.25,
  };
  constructor(props) {
    super(props);
    this.state = {
      hasWon: false,
      board: this.createBoard(),
      out1: true,
      out2: false,
    };
    this.flipCellsAround = this.flipCellsAround.bind(this);
    this.playAgain = this.playAgain.bind(this);
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        row.push(Math.random() < this.props.lightsOn);
      }
      board.push(row);
    }
    return board;
  }
  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    //flip initial cell
    flipCell(y, x);
    //flip neighboring cells
    flipCell(y, x + 1); //right
    flipCell(y, x - 1); //left
    flipCell(y + 1, x); //below
    flipCell(y - 1, x); //above

    // win when every cell is turned off
    let hasWon = board.every((row) => row.every((cell) => !cell));

    this.setState({ board, hasWon });
  }

  // Reset the board
  playAgain() {
    this.setState({
      board: this.createBoard(),
      hasWon: false,
    });
  }

  // set timer to switch between out1 and out2
  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState((st) => ({
        out1: !st.out1,
        out2: !st.out2,
      }));
    }, 2000);
  }

  /** Render game board or winning message. */

  render() {
    const { nrows, ncols } = this.props;
    const { board, hasWon, out1, out2 } = this.state;
    let out;
    let tblBoard = [];
    for (let y = 0; y < nrows; y++) {
      let row = [];
      for (let x = 0; x < ncols; x++) {
        let coord = `${y}-${x}`;
        row.push(
          <Cell
            key={coord}
            isLit={board[y][x]}
            coord={coord}
            flipCellsAroundMe={this.flipCellsAround}
          />
        );
      }
      tblBoard.push(<tr>{row}</tr>);
    }
    if (out1) out = "out1";
    if (out2) out = "out2";
    if (hasWon)
      return (
        <div>
          <p id="hasWon">You Won</p>
          <button onClick={this.playAgain}>Play Again</button>
        </div>
      );
    return (
      <div>
        <div id="container">
          <h1>
            <span className="lights">Lights </span>
            <span className={out}>Out</span>
          </h1>
        </div>
        <table className="Board">
          <tbody>{tblBoard}</tbody>
        </table>
      </div>
    );
  }
}

export default Board;
