
$(document).ready(function() {
  gameOptions.init();
  game.init(10);
});

var board = {
  board: [],
  size: 10,
  mineCount: 0,
  mineRatio: 0.2,
  init: function(size) {
    this.board = [];
    this.size = size;
    $(".board-container").empty();
    this.mineCount = Math.floor(this.size * this.size * this.mineRatio);
    this.newBoard();
    this.addMines();
    this.addHints();
    this.renderBoard();
    this.preventRightClickMenu();
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
      $square.addClass("revealed");
      $square.addClass("mine");
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
  addOrRemoveFlag: function($square) {
    if ($square.hasClass("flagged")) {
      $square.removeClass("flagged");
    } else {
      if (!$square.hasClass("revealed")) $square.addClass("flagged");
    }
  },
  preventRightClickMenu: function() {
    $(".board").on("contextmenu", function(e) {
      e.preventDefault();
    }, false);
  },
};

var game = {
  lose: false,
  win: false,
  size: 10,
  init: function(size) {
    game.size = size;
    board.init(game.size);
    $(".gameover-text h2").text("");
    $("#play-again-btn").hide();
    game.lose = false;
    game.win = false;
    game.clickSquare();
  },
  clickSquare: function() {
    $(".board-square").mousedown(function() {
      if (!game.lose && !game.win) {
        switch (event.which) {
          case 1:
            board.revealSquare($(this));
            game.checkLoss($(this));
            game.checkWin($(this));
            break;
          case 3:
            board.addOrRemoveFlag($(this));
            game.checkWin($(this));
            break;
          default:
            return;
        }
        game.gameoverScreen();
      }
    });
  },
  checkLoss: function($square) {
    if ($square.text() === "M") game.lose = true;
  },
  checkWin: function() {
    var win = true;
    $(".board-square").each(function() {
      if (($(this).text() != "M" && !$(this).hasClass("revealed")) ||
         ($(this).text() === "M" && !$(this).hasClass("flagged"))) {
        win = false;
        return false;
      }
    });
    if (win) game.win = true;
  },
  gameoverScreen: function() {
    if (game.win) {
      $(".gameover-text h2").text("You win!");
      $("#play-again-btn").show();
      game.playAgain();
    } else if (game.lose) {
      $(".gameover-text h2").text("You lose!");
      $("#play-again-btn").show();
      game.playAgain();
    }
  },
  playAgain: function() {
    $("#play-again-btn").on("click", function() {
      game.init(game.size);
    });
  },
};

var gameOptions = {
  init: function() {
    this.boardSizeDropdown();
    this.chooseBoardSize();
    this.newGame();
  },
  boardSizeDropdown: function() {
    $("#board-size-btn").on("click", function() {
      $(".board-size-dropdown").toggleClass("show-dropdown");
    });

    $(document).mouseup(function(e) {
      var $dropdown = $(".board-size-dropdown");
      if (!$dropdown.is(e.target) && !$("#board-size-btn").is(e.target) &&
          $dropdown.has(e.target).length === 0) {
        $dropdown.removeClass("show-dropdown");
      }
    });
  },
  chooseBoardSize: function() {
    $(".board-size-type").on("click", function() {
      console.log($(this).text());
      switch($(this).text()) {
        case "Tiny":
          game.init(5);
          break;
        case "Small":
          game.init(10);
          break;
        case "Medium":
          game.init(15);
          break;
        case "Large":
          game.init(23);
          break;
        case "Enormous":
          game.init(35);
          break;
        default:
          return;
      }
      $(".board-size-type").removeClass("current-board-size");
      $(this).addClass("current-board-size");
      $(".board-size-dropdown").removeClass("show-dropdown");
    });
  },
  newGame: function() {
    $("#new-game-btn").on("click", function() {
      game.init(game.size);
    });
  },
};
