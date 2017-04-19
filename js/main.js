
$(document).ready(function() {
  board.init();
});

var board = {
  board: [],
  size: 9,
  init: function() {
    this.board = [];
    this.newBoard();
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