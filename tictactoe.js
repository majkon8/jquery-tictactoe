"use strict";

const model = {
  onePlayerMode: undefined, //Two player mode if false
  difficulty: undefined, //"easy" or "hard
  playerOneSymbol: undefined, //"x" or "o"
  playerTwoSymbol: undefined,
  playerOneTurn: undefined,
  haveClicked: false, //if clicked a field lately
  numberOfMoves: 0,
  playerOneScore: 0,
  playerTwoScore: 0,
  board: [[9, 9, 9], [9, 9, 9], [9, 9, 9]], //9 means empty field, 0 is "o" and 1 is "x"
  randomizeStarter: () => {
    const random = Math.floor(Math.random() * 2);
    random === 0 ? (model.playerOneTurn = true) : (model.playerOneTurn = false);
  },
  canMakeMove: clickedField => {
    const fieldValue = model.parseFieldChoice(clickedField)[0];
    return fieldValue === 9 &&
    !model.haveClicked && //not clicked recently
    !model.endOfRound(0) && //round not ended by player 1 nor by player 1
      !model.endOfRound(1) &&
      (!model.onePlayerMode || (model.onePlayerMode && model.playerOneTurn))
      ? true
      : false;
  },
  currentPlayerSymbol: () => {
    return model.playerOneTurn ? model.playerOneSymbol : model.playerTwoSymbol;
  },
  symbolId: symbol => {
    return symbol === "O" ? 0 : 1; // 0 if "O" and 1 if "X"
  },
  //returns proper element of board array
  parseFieldChoice: clickedField => {
    const row = clickedField.id[6];
    const column = clickedField.id[7];
    return [model.board[row][column], row, column];
  },
  //picks random number from two numbers
  pickRandom: (num1, num2) => {
    const random = Math.floor(Math.random() * 2);
    return random === 0 ? num1 : num2;
  },
  //checks if round is ended by winning or by draw
  endOfRound: num => {
    for (let row of model.board) {
      if (JSON.stringify(row) === JSON.stringify([num, num, num])) {
        model.playerOneTurn ? model.playerOneScore++ : model.playerTwoScore++;
        let rowNumber = 0; //which row is the winning one
        for (let i = 0; i < 3; i++) {
          if (JSON.stringify(row) !== JSON.stringify(model.board[i])) {
            rowNumber++;
          } else {
            break;
          }
        }
        return [`${rowNumber}0`, `${rowNumber}1`, `${rowNumber}2`];
      }
    }
    if (
      model.board[0][0] === num &&
      model.board[1][1] === num &&
      model.board[2][2] === num
    ) {
      model.playerOneTurn ? model.playerOneScore++ : model.playerTwoScore++;
      return ["00", "11", "22"];
    } else if (
      model.board[0][2] === num &&
      model.board[1][1] === num &&
      model.board[2][0] === num
    ) {
      model.playerOneTurn ? model.playerOneScore++ : model.playerTwoScore++;
      return ["02", "11", "20"];
    }
    for (let i = 0; i < 3; i++) {
      if (
        model.board[0][i] === num &&
        model.board[1][i] === num &&
        model.board[2][i] === num
      ) {
        model.playerOneTurn ? model.playerOneScore++ : model.playerTwoScore++;
        const colNumber = i;
        return [`0${colNumber}`, `1${colNumber}`, `2${colNumber}`];
      }
    }
    if (model.numberOfMoves === 9) {
      model.randomizeStarter();
      return "draw";
    }
    return false;
  },
  generateRandomField: () => {
    //only for AI
    do {
      var row = Math.floor(Math.random() * 3);
      var column = Math.floor(Math.random() * 3);
    } while (model.board[row][column] !== 9);
    return `${row}${column}`;
  },
  checkForWinningMove: symbolId => {
    //only for AI Hard mode
    const id = symbolId;
    for (let i = 0; i < 3; i++) {
      if (JSON.stringify(model.board[i]) === JSON.stringify([9, id, id])) {
        return `${i}0`;
      } else if (
        JSON.stringify(model.board[i]) === JSON.stringify([id, 9, id])
      ) {
        return `${i}1`;
      } else if (
        JSON.stringify(model.board[i]) === JSON.stringify([id, id, 9])
      ) {
        return `${i}2`;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        model.board[0][i] === 9 &&
        model.board[1][i] === id &&
        model.board[2][i] === id
      ) {
        return `0${i}`;
      } else if (
        model.board[0][i] === id &&
        model.board[1][i] === 9 &&
        model.board[2][i] === id
      ) {
        return `1${i}`;
      } else if (
        model.board[0][i] === id &&
        model.board[1][i] === id &&
        model.board[2][i] === 9
      ) {
        return `2${i}`;
      }
    }
    if (
      model.board[0][0] === 9 &&
      model.board[1][1] === id &&
      model.board[2][2] === id
    ) {
      return "00";
    } else if (
      model.board[0][0] === id &&
      model.board[1][1] === 9 &&
      model.board[2][2] === id
    ) {
      return "11";
    } else if (
      model.board[0][0] === id &&
      model.board[1][1] === id &&
      model.board[2][2] === 9
    ) {
      return "22";
    } else if (
      model.board[0][2] === 9 &&
      model.board[1][1] === id &&
      model.board[2][0] === id
    ) {
      return "02";
    } else if (
      model.board[0][2] === id &&
      model.board[1][1] === 9 &&
      model.board[2][0] === id
    ) {
      return "11";
    } else if (
      model.board[0][2] === id &&
      model.board[1][1] === id &&
      model.board[2][0] === 9
    ) {
      return "20";
    }
    return false;
  },
  checkForRationalMove: () => {
    //only for AI hard mode, to avoid very stupid moves
    const id = model.symbolId(model.playerTwoSymbol); //id of comp symbol
    if (
      model.board[0][0] === id &&
      model.board[1][1] === 9 &&
      model.board[2][2] === 9
    ) {
      const random = model.pickRandom(1, 2);
      return `${random}${random}`;
    } else if (
      model.board[0][0] === 9 &&
      model.board[1][1] === id &&
      model.board[2][2] === 9
    ) {
      const random = model.pickRandom(0, 2);
      return `${random}${random}`;
    } else if (
      model.board[0][0] === 9 &&
      model.board[1][1] === 9 &&
      model.board[2][2] === id
    ) {
      const random = model.pickRandom(0, 1);
      return `${random}${random}`;
    } else if (
      model.board[0][2] === id &&
      model.board[1][1] === 9 &&
      model.board[2][0] === 9
    ) {
      const random = model.pickRandom(0, 1);
      return random === 0 ? "11" : "20";
    } else if (
      model.board[0][2] === 9 &&
      model.board[1][1] === id &&
      model.board[2][0] === 9
    ) {
      const random = model.pickRandom(0, 1);
      return random === 0 ? "02" : "20";
    } else if (
      model.board[0][2] === 9 &&
      model.board[1][1] === 9 &&
      model.board[2][0] === id
    ) {
      const random = model.pickRandom(0, 1);
      return random === 0 ? "02" : "11";
    }
    for (let i = 0; i < 3; i++) {
      if (JSON.stringify(model.board[i]) === JSON.stringify([id, 9, 9])) {
        const random = model.pickRandom(1, 2);
        return `${i}${random}`;
      } else if (
        JSON.stringify(model.board[i]) === JSON.stringify([9, id, 9])
      ) {
        const random = model.pickRandom(0, 2);
        return `${i}${random}`;
      } else if (
        JSON.stringify(model.board[i]) === JSON.stringify([9, 9, id])
      ) {
        const random = model.pickRandom(0, 1);
        return `${i}${random}`;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        model.board[0][i] === id &&
        model.board[1][i] === 9 &&
        model.board[2][i] === 9
      ) {
        const random = model.pickRandom(1, 2);
        return `${random}${i}`;
      } else if (
        model.board[0][i] === 9 &&
        model.board[1][i] === id &&
        model.board[2][i] === 9
      ) {
        const random = model.pickRandom(0, 2);
        return `${random}${i}`;
      } else if (
        model.board[0][i] === 9 &&
        model.board[1][i] === 9 &&
        model.board[2][i] === id
      ) {
        const random = model.pickRandom(0, 1);
        return `${random}${i}`;
      }
    }
    if (
      model.board[0][0] === 9 ||
      model.board[0][2] === 9 ||
      model.board[2][0] === 9 ||
      model.board[2][2] === 9
    ) {
      const random1 = model.pickRandom(0, 2);
      const random2 = model.pickRandom(0, 2);
      return `${random1}${random2}`;
    }
    return false;
  },
  //only for AI hard mode
  generateHardDiffField: () => {
    const compSymbolId = model.symbolId(model.playerTwoSymbol); //id of comp symbol
    let playerSymbolId;
    compSymbolId === 0 ? (playerSymbolId = 1) : (playerSymbolId = 0);
    //if computer was starting
    if (model.numberOfMoves % 2 === 0) {
      const winningComp = model.checkForWinningMove(compSymbolId); //check for comp winning moves first
      if (winningComp === false) {
        const winningPlayer = model.checkForWinningMove(playerSymbolId); //check for player winning moves later
        if (winningPlayer === false) {
          const rational = model.checkForRationalMove();
          if (rational === false) {
            return model.generateRandomField();
          } else {
            return rational;
          }
        } else {
          return winningPlayer;
        }
      } else {
        return winningComp;
      }
    } else {
      const winningPlayer = model.checkForWinningMove(playerSymbolId);
      if (winningPlayer === false) {
        const winningComp = model.checkForWinningMove(compSymbolId);
        if (winningComp === false) {
          const rational = model.checkForRationalMove();
          if (rational === false) {
            return model.generateRandomField();
          } else {
            return rational;
          }
        } else {
          return winningComp;
        }
      } else {
        return winningPlayer;
      }
    }
  }
};

const view = {
  gameOverScreenTimeout: undefined,
  toggleScreen: (fadeOutScreen, fadeInScreen, time = 300) => {
    $(fadeOutScreen).fadeOut(time);
    $(fadeInScreen)
      .delay(time)
      .fadeIn(time);
  },
  fillWithProperText: () => {
    if (model.onePlayerMode) {
      $("#choose-x-o-message").html("Would you like to be X or O?");
      $("#left-turn-indicator").html("Your turn!");
      $("#right-turn-indicator").html("Computer's turn");
      $("#player2-computer").html("Computer");
    } else {
      $("#choose-x-o-message").html("Player 1: Would you like X or O?");
      $("#left-turn-indicator").html("Go player 1!");
      $("#right-turn-indicator").html("Go player 2!");
      $("#player2-computer").html("Player 2");
    }
  },
  showTurnIndicator: (collapseAll = false) => {
    const distance = $("#left-turn-indicator").height();
    if (model.playerOneTurn && !collapseAll) {
      $("#left-turn-indicator").animate({ top: "0" }, 300);
      $("#right-turn-indicator").animate({ top: `${distance}px` }, 300);
    } else if (!model.playerOneTurn && !collapseAll) {
      $("#right-turn-indicator").animate({ top: "0" }, 300);
      $("#left-turn-indicator").animate({ top: `${distance}px` }, 300);
    } else if (collapseAll) {
      $("#left-turn-indicator").animate({ top: `${distance}px` }, 300);
      $("#right-turn-indicator").animate({ top: `${distance}px` }, 300);
    }
  },
  displayEndOfRound: (playerOneWon, [firstField, secondField, thirdField]) => {
    if (firstField === "draw") {
      $("#game-over-screen").html("It was a draw");
    } else {
      let cssClass;
      if (playerOneWon === true) {
        cssClass = "field-player-one";
      } else {
        cssClass = "field-player-two";
      }
      $(`#field-${firstField}`).addClass(cssClass);
      $(`#field-${secondField}`).addClass(cssClass);
      $(`#field-${thirdField}`).addClass(cssClass);
      if (!model.onePlayerMode && playerOneWon === true) {
        $("#game-over-screen").html("Player 1 wins!");
      } else if (!model.onePlayerMode && playerOneWon === false) {
        $("#game-over-screen").html("Player 2 wins!");
      } else if (model.onePlayerMode && playerOneWon === true) {
        $("#game-over-screen").html("You won!");
      } else if (model.onePlayerMode && playerOneWon === false) {
        $("#game-over-screen").html("You lost!");
      }
    }
    view.showTurnIndicator(true);
    view.gameOverScreenTimeout = setTimeout(() => {
      $("#game-over-screen").fadeIn();
    }, 1000);
    $("#player-one-score").html(model.playerOneScore);
    $("#player-two-score").html(model.playerTwoScore);
  },
  drawNewRound: () => {
    $("#game-over-screen").fadeOut();
    $(".board-field").html("");
    $(".board-field").removeClass("field-player-one");
    $(".board-field").removeClass("field-player-two");
  }
};

const controller = {
  newRoundTimer: undefined,
  randomMoveTimeout: undefined,
  startGame: () => {
    model.randomizeStarter();
    setTimeout(() => {
      view.showTurnIndicator();
      if (model.onePlayerMode && !model.playerOneTurn) {
        controller.makeComputerMove();
      }
    }, 1500);
  },
  resetGame: () => {
    view.showTurnIndicator(true);
    clearTimeout(controller.newRoundTimer);
    clearTimeout(view.gameOverScreenTimeout);
    clearTimeout(controller.randomMoveTimeout);
    model.board = [[9, 9, 9], [9, 9, 9], [9, 9, 9]];
    model.numberOfMoves = 0;
    model.numberOfMoves = 0;
    model.playerOneScore = 0;
    model.playerTwoScore = 0;
    model.haveClicked = false;
    $("#player-one-score").html(model.playerOneScore);
    $("#player-two-score").html(model.playerTwoScore);
    view.drawNewRound();
    view.toggleScreen("#game-board-screen", "#start-screen", 0);
  },
  handleOptionClick: e => {
    if (e.target.id === "choose-player-one") {
      model.onePlayerMode = true;
      view.fillWithProperText();
      view.toggleScreen("#start-screen", "#difficulty-screen");
    } else if (e.target.id === "choose-player-two") {
      model.onePlayerMode = false;
      view.fillWithProperText();
      view.toggleScreen("#start-screen", "#choose-x-o-screen");
    } else if (e.target.id === "choose-easy-diff") {
      model.difficulty = "easy";
      view.toggleScreen("#difficulty-screen", "#choose-x-o-screen");
    } else if (e.target.id === "choose-hard-diff") {
      model.difficulty = "hard";
      view.toggleScreen("#difficulty-screen", "#choose-x-o-screen");
    } else if (e.target.id === "choose-x") {
      model.playerOneSymbol = "X";
      model.playerTwoSymbol = "O";
      view.toggleScreen("#choose-x-o-screen", "#game-board-screen");
      controller.startGame();
    } else if (e.target.id === "choose-o") {
      model.playerOneSymbol = "O";
      model.playerTwoSymbol = "X";
      view.toggleScreen("#choose-x-o-screen", "#game-board-screen");
      controller.startGame();
    }
  },
  handleBackClick: e => {
    const parentId = $(e.target)
      .parent()
      .attr("id");
    if (parentId === "difficulty-screen") {
      view.toggleScreen(`#${parentId}`, "#start-screen");
    } else if (parentId === "choose-x-o-screen" && !model.onePlayerMode) {
      view.toggleScreen(`#${parentId}`, "#start-screen");
    } else if (parentId === "choose-x-o-screen" && model.onePlayerMode) {
      view.toggleScreen(`#${parentId}`, "#difficulty-screen");
    }
  },
  endRoundOrContinue: symbolId => {
    const winningFields = model.endOfRound(symbolId);
    if (winningFields === false) {
      model.playerOneTurn
        ? (model.playerOneTurn = false)
        : (model.playerOneTurn = true);
      model.haveClicked = false;
      view.showTurnIndicator();
      return false;
    } else {
      winningFields === "draw"
        ? view.displayEndOfRound(model.playerOneTurn, ["draw", "draw", "draw"])
        : view.displayEndOfRound(model.playerOneTurn, winningFields);
      controller.nextRound();
      return true;
    }
  },
  makeMove: clickedField => {
    if (model.canMakeMove(clickedField)) {
      model.haveClicked = true;
      model.numberOfMoves++;
      const symbol = model.currentPlayerSymbol();
      const symbolId = model.symbolId(symbol);
      const row = model.parseFieldChoice(clickedField)[1];
      const column = model.parseFieldChoice(clickedField)[2];
      model.board[row][column] = symbolId;
      $(clickedField).html(symbol);
      const isRoundEnded = controller.endRoundOrContinue(symbolId);
      if (!isRoundEnded && model.onePlayerMode && !model.playerOneTurn) {
        controller.makeComputerMove();
      }
    }
  },
  nextRound: () => {
    model.board = [[9, 9, 9], [9, 9, 9], [9, 9, 9]];
    model.numberOfMoves = 0;
    model.haveClicked = false;
    controller.newRoundTimer = setTimeout(() => {
      view.drawNewRound();
      view.showTurnIndicator();
      if (model.onePlayerMode && !model.playerOneTurn) {
        controller.makeComputerMove();
      }
    }, 4000);
  },
  makeComputerMove: () => {
    if (!model.haveClicked) {
      model.haveClicked = true;
      let rowAndCol;
      if (model.difficulty === "easy") {
        rowAndCol = model.generateRandomField();
      } else if (model.difficulty === "hard") {
        //do while in case something went wrong with my AI logic
        do {
          rowAndCol = model.generateHardDiffField();
        } while (model.board[rowAndCol[0]][rowAndCol[1]] !== 9);
      }
      const row = rowAndCol[0];
      const column = rowAndCol[1];
      model.numberOfMoves++;
      const symbol = model.currentPlayerSymbol();
      const symbolId = model.symbolId(symbol);
      model.board[row][column] = symbolId;
      controller.randomMoveTimeout = setTimeout(() => {
        $(`#field-${rowAndCol}`).html(symbol);
        controller.endRoundOrContinue(symbolId);
      }, 700);
    }
  }
};

$("#game-board-screen").css("display", "flex");
$("#game-board-screen").hide();
$(".option").click(e => controller.handleOptionClick(e));
$(".back-button").click(e => controller.handleBackClick(e));
$("#reset-button").click(() => controller.resetGame());
$(".board-field").click(e => controller.makeMove(e.target));
