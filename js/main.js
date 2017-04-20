
$(document).ready(function() {
  $(document).on("contextmenu", function(e) {
    e.preventDefault();
  }, false);
  game.init();
});

var board = {
  board: [],
  size: 9,
  mineCount: 0,
  mineRatio: 0.3,
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
      while (this.board[randomRow][randomCol] == "M") {
        randomRow = Math.floor(Math.random() * (this.size));
        randomCol = Math.floor(Math.random() * (this.size));
      }
      this.board[randomRow][randomCol] = "M";
    }
  },
  addHints: function() {
    for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j++) {
        if (this.board[i][j] != "M") {
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
           this.board[row][col] === "M";
  },
  renderBoard: function() {
    $(".board-container").append("<table class='board'></table>");
    for (var i = 0; i < this.size; i++) {
      $(".board").append("<tr class='board-row-" + i + "'></tr>");
      for (var j = 0; j < this.size; j++) {
        $(".board-row-" + i).append("<td class='board-square' data-row='" + i + 
                                    "' data-col='" + j + "'><p>" + 
                                    this.board[i][j] + "</p></td>")
      }
    }
  },
  revealSquare: function($square) {
    $square.removeClass("flagged");
    var row = $square.data("row");
    var col = $square.data("col");
    var value = board.board[row][col];
    if (value === "M") {
      $square.find("p").show()
      $square.addClass("revealed");
    } else if (value === 0) {
      $square.find("p").text("").show();
      $square.addClass("revealed");
      this.showHint(row - 1, col - 1);
      this.showHint(row - 1, col);
      this.showHint(row - 1, col + 1);
      this.showHint(row, col - 1);
      this.showHint(row, col + 1);
      this.showHint(row + 1, col - 1);
      this.showHint(row + 1, col);
      this.showHint(row + 1, col + 1);
    } else {
      $square.find("p").show();
      $square.addClass("revealed");
    }
  },
  showHint: function(row, col) {
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) return;
    var $square = $(".board-square[data-row='" + row + "'][data-col='" + col + "']");
    if ($square.text() != "M" && !$square.hasClass("revealed")) {
      if ($square.text() === "0") {
        board.revealSquare($square);
      } else {
        $square.find("p").show();
        $square.addClass("revealed");
      }
    }
  },
  addFlag: function($square) {
    $square.addClass("flagged");
  },
};

var game = {
  init: function() {
    board.init();
    this.clickSquare();
  },
  clickSquare: function() {
    $(".board-square").mousedown(function() {
      switch (event.which) {
        case 1:
          board.revealSquare($(this));
          break;
        case 3:
          board.addFlag($(this));
          break;
        default:
          return
      }
    });
  },
};