
$(document).ready(function() {
  board.init();
});

var board = {
  board: [],
  size: 9,
  mineCount: 0,
  mineRatio: 0.4,
  init: function() {
    this.board = [];
    this.mineCount = Math.floor(this.size * this.size * this.mineRatio);
    this.newBoard();
    this.addMines();
    this.addHints();
    this.renderBoard();
  },
  newBoard: function() {
    for (var i = 0; i < this.size; i++) {
      this.board.push([]);
      for (var j = 0; j < this.size; j++) {
        this.board[i].push("");
      }
    }
  },
  addMines: function() {
    for (var i = 0; i < this.mineCount; i++) {
      var randomRow = Math.floor(Math.random() * (this.size));
      var randomCol = Math.floor(Math.random() * (this.size));
      while (this.board[randomRow][randomCol] == "mine") {
        randomRow = Math.floor(Math.random() * (this.size));
        randomCol = Math.floor(Math.random() * (this.size));
      }
      this.board[randomRow][randomCol] = "mine";
    }
  },
  addHints: function() {
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        if (this.board[i][j] != "mine") {
          var count = 0;
          if (this.isMine(i - 1, j - 1)) count += 1;
          if (this.isMine(i - 1, j)) count += 1;
          if (this.isMine(i - 1, j + 1)) count += 1;
          if (this.isMine(i, j - 1)) count += 1;
          if (this.isMine(i, j + 1)) count += 1;
          if (this.isMine(i + 1, j - 1)) count += 1;
          if (this.isMine(i + 1, j)) count += 1;
          if (this.isMine(i + 1, j + 1)) count += 1;
          this.board[i][j] = count;
        }
      }
    }
  },
  isMine: function(row, col) {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) return;
    return this.board[row][col] != "undefined" &&
           this.board[row][col] === "mine";
  },
  renderBoard: function() {
    $(".board-container").append("<table class='board'></table>");
    for (var i = 0; i < this.size; i++) {
      $(".board").append("<tr class='board-row-" + i + "'></tr>");
      for (var j = 0; j < this.size; j++) {
        $(".board-row-" + i).append("<td class='board-space' data-row='" + i + 
                                    "' data-col='" + j + "'>" + 
                                    this.board[i][j] + "</td>")
      }
    }
  },
};