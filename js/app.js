const BOARD_SIZE = 8;
const WHITE_PLAYER = "white";
const BLACK_PLAYER = "black";

const PAWN = "pawn";
const ROOK = "rook";
const KNIGHT = "knight";
const BISHOP = "bishop";
const KING = "king";
const QUEEN = "queen";

let SELECTED_CELL;
let BOARD_DATA;
let TABLE;

class Piece {
  constructor(row, col, type, player) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.player = player;
  }

  getOpponent() {
    if (this.player === WHITE_PLAYER) {
      return BLACK_PLAYER;
    }
    return WHITE_PLAYER;
  }

  getPossibleMoves(boardData) {
    // Get relative moves
    let moves;
    if (this.type === PAWN) {
      moves = this.getPawnMoves(boardData);
    } else if (this.type === ROOK) {
      moves = this.getRookMoves(boardData);
    } else if (this.type === KNIGHT) {
      moves = this.getKnightMoves(boardData);
    } else if (this.type === BISHOP) {
      moves = this.getBishopMoves(boardData);
    } else if (this.type === KING) {
      moves = this.getKingMoves(boardData);
    } else if (this.type === QUEEN) {
      moves = this.getQueenMoves(boardData);
    } else {
      console.log("Unknown type", type);
    }

    // // Get absolute moves
    // let absoluteMoves = [];
    // for (let relativeMove of relativeMoves) {
    //   const absoluteRow = this.row + relativeMove[0];
    //   const absoluteCol = this.col + relativeMove[1];
    //   absoluteMoves.push([absoluteRow, absoluteCol]);
    // }

    // Get filtered absolute moves
    let filteredMoves = [];
    for (let absoluteMove of moves) {
      const absoluteRow = absoluteMove[0];
      const absoluteCol = absoluteMove[1];
      if (
        absoluteRow >= 0 &&
        absoluteRow <= 7 &&
        absoluteCol >= 0 &&
        absoluteCol <= 7
      ) {
        filteredMoves.push(absoluteMove);
      }
    }
    return filteredMoves;
  }

  getPawnMoves(boardData) {
    let result = [];
    let direction = 1;
    if (this.player === BLACK_PLAYER) {
      direction = -1;
    }

    let position = [this.row + direction, this.col];
    if (boardData.isEmpty(position[0], position[1])) {
      result.push(position);
    }

    position = [this.row + direction, this.col + direction];
    if (boardData.isPlayer(position[0], position[1], this.getOpponent())) {
      result.push(position);
    }

    position = [this.row + direction, this.col - direction];
    if (boardData.isPlayer(position[0], position[1], this.getOpponent())) {
      result.push(position);
    }

    return result;
  }

  getRookMoves(boardData) {
    let result = [];
    result = result.concat(this.getMovesInDirection(-1, 0, boardData));
    result = result.concat(this.getMovesInDirection(1, 0, boardData));
    result = result.concat(this.getMovesInDirection(0, -1, boardData));
    result = result.concat(this.getMovesInDirection(0, 1, boardData));
    return result;
  }

  getMovesInDirection(directionRow, directionCol, boardData) {
    let result = [];

    for (let i = 1; i < BOARD_SIZE; i++) {
      let row = this.row + directionRow * i;
      let col = this.col + directionCol * i;
      if (boardData.isEmpty(row, col)) {
        result.push([row, col]);
      } else if (boardData.isPlayer(row, col, this.getOpponent())) {
        result.push([row, col]);
        console.log("opponent");
        return result;
      } else if (boardData.isPlayer(row, col, this.player)) {
        console.log("player");
        return result;
      }
    }
    // console.log("all empty");
    console.log(result);
    return result;
  }

  getKnightMoves(boardData) {
    let result = [];
    const relativeMoves = [
      [2, 1],
      [2, -1],
      [-2, 1],
      [-2, -1],
      [-1, 2],
      [1, 2],
      [-1, -2],
      [1, -2],
    ];
    for (let relativeMove of relativeMoves) {
      let row = this.row + relativeMove[0];
      let col = this.col + relativeMove[1];
      if (!boardData.isPlayer(row, col, this.player)) {
        result.push([row, col]);
      }
    }
    return result;
  }

  getBishopMoves(boardData) {
    let result = [];
    result = result.concat(this.getMovesInDirection(-1, -1, boardData));
    result = result.concat(this.getMovesInDirection(-1, 1, boardData));
    result = result.concat(this.getMovesInDirection(1, -1, boardData));
    result = result.concat(this.getMovesInDirection(1, 1, boardData));
    return result;
  }

  getKingMoves(boardData) {
    let result = [];
    const relativeMoves = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    for (let relativeMove of relativeMoves) {
      let row = this.row + relativeMove[0];
      let col = this.col + relativeMove[1];
      if (!boardData.isPlayer(row, col, this.player)) {
        result.push([row, col]);
      }
    }
    return result;
  }

  getQueenMoves(boardData) {
    let result = this.getBishopMoves(boardData);
    result = result.concat(this.getRookMoves(boardData));
    return result;
  }
}

class BoardData {
  constructor(pieces) {
    this.pieces = pieces;
    this.selectedPieceRow = -1;
    this.selectedPieceCol = -1;
  }

  // Returns piece in row, col, or undefined if not exists.
  getPiece(row, col) {
    for (const piece of this.pieces) {
      if (piece.row === row && piece.col === col) {
        this.selectedPieceRow = row;
        this.selectedPieceCol = col;
        return piece;
      }
    }
    this.selectedPiece = null;
  }

  isEmpty(row, col) {
    return this.getPiece(row, col) === undefined;
  }
  //check if there is a player
  isPlayer(row, col, player) {
    const piece = this.getPiece(row, col);
    return piece !== undefined && piece.player === player;
  }

  playerMove(currRow, currCol, prevRow, prevCol) {
    const index = pieces.findIndex((x) => x.row == prevRow && x.col == prevCol);
    this.pieces[index].row = currRow;
    this.pieces[index].col = currCol;
  }
}

function getInitialPieces() {
  let result = [];

  addFirstRowPieces(result, 0, WHITE_PLAYER);
  addFirstRowPieces(result, 7, BLACK_PLAYER);

  for (let i = 0; i < BOARD_SIZE; i++) {
    result.push(new Piece(1, i, PAWN, WHITE_PLAYER));
    result.push(new Piece(6, i, PAWN, BLACK_PLAYER));
  }
  return result;
}

function addFirstRowPieces(result, row, player) {
  result.push(new Piece(row, 0, ROOK, player));
  result.push(new Piece(row, 1, KNIGHT, player));
  result.push(new Piece(row, 2, BISHOP, player));
  result.push(new Piece(row, 3, KING, player));
  result.push(new Piece(row, 4, QUEEN, player));
  result.push(new Piece(row, 5, BISHOP, player));
  result.push(new Piece(row, 6, KNIGHT, player));
  result.push(new Piece(row, 7, ROOK, player));
}
// function movePiece(row, col, row1, col1) {}

function addImage(cell, player, name) {
  const image = document.createElement("img");
  image.src = "images/" + player + "/" + name + ".png";
  cell.appendChild(image);
}

function onCellClick(event, row, col) {
  // Clear all previous possible moves
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      TABLE.rows[i].cells[j].classList.remove("possible-move");
    }
  }

  if (BOARD_DATA.selectedPieceRow !== -1) {
    // PREV
    console.log({
      prevRow: BOARD_DATA.selectedPieceRow,
      prevCol: BOARD_DATA.selectedPieceCol,
    });
    // CURRENT
    console.log({ currentRow: row, currentCol: col });

    //console.log(TABLE.rows[row].cells[col]);

    // STEP 1: Add image to current
    TABLE.rows[row].cells[col].innerHTML = "PIECE";

    // STEP 2: Clean Prev
    TABLE.rows[BOARD_DATA.selectedPieceRow].cells[
      BOARD_DATA.selectedPieceCol
    ].innerHTML = "";

    BOARD_DATA.playerMove(
      row,
      col,
      BOARD_DATA.selectedPieceRow,
      BOARD_DATA.selectedPieceCol
    );
    BOARD_DATA.selectedPieceRow = -1;
    BOARD_DATA.selectedPieceCol = -1;
  } else {
    // Show possible moves
    const piece = BOARD_DATA.getPiece(row, col);
    if (piece !== undefined) {
      let possibleMoves = piece.getPossibleMoves(BOARD_DATA);
      for (let possibleMove of possibleMoves) {
        const cell = TABLE.rows[possibleMove[0]].cells[possibleMove[1]];
        cell.classList.add("possible-move");
      }
    }
  }

  // Clear previously selected cell
  if (SELECTED_CELL !== undefined) {
    SELECTED_CELL.classList.remove("selected");
  }

  // Show selected cell
  SELECTED_CELL = event.currentTarget;
  SELECTED_CELL.classList.add("selected");
}
function createChessBoard() {
  // Create list of pieces (32 total)
  const head1 = document.createElement("h1");
  head1.classList.add("head");
  head1.textContent = "Chess Table JS";
  const Body = document.body;
  Body.appendChild(head1);
  TABLE = document.createElement("table");
  TABLE.className = "table";
  Body.appendChild(TABLE);
  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowElement = TABLE.insertRow();
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = rowElement.insertCell();
      if ((row + col) % 2 === 0) {
        cell.className = "light-cell";
      } else {
        cell.className = "dark-cell";
      }
      cell.addEventListener("click", (event) => onCellClick(event, row, col));
    }
  }
  BOARD_DATA = new BoardData(getInitialPieces());
  console.log(BOARD_DATA);
  pieces = BOARD_DATA.pieces;
  console.log(pieces);

  // Add pieces images to board
  for (let piece of pieces) {
    const cell = TABLE.rows[piece.row].cells[piece.col];
    addImage(cell, piece.player, piece.type);
  }
}

window.addEventListener("load", createChessBoard);
