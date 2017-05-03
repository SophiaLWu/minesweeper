
function setUpHTMLFixture() {
  setFixtures('<div class="board-wrapper">'
            +   '<div class="board-container">'
            +   '</div>'
            + '</div>');
}


describe("Board object", function() {
  
  describe("init()", function() {
    beforeAll(function() {
      board.init(10);
    });

    it("when given 10, sets size to 10", function() {
      expect(board.size).toEqual(10);
    });

    it("sets mineCount to 20 when board size is 10x10", function() {
      expect(board.mineCount).toEqual(20);
    });

    it("sets mineCount equal to flags", function() {
      expect(board.mineCount).toEqual(board.flags);
    });
  });

  describe("newBoard()", function() {
    beforeAll(function() {
      board.init(10);
      board.board = [];
    });

    it("if size is 10, creates a 2D empty array of size 10x10", function() {
      board.newBoard();
      expect(board.board.length).toEqual(10);
      expect(board.board[0].length).toEqual(10);
    });
  });

  describe("addMines()", function() {
    beforeAll(function() {
      board.init(10);
      board.board = [];
    });

    it("with a board size of 10, randomly adds 20 'M's to the board array", 
       function() {
      board.newBoard();
      board.addMines();
      var mineCount = 0;
      for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
          if (board.board[i][j] === "M") mineCount += 1;
        }
      }
      expect(mineCount).toEqual(board.mineCount);
    });
  });

  describe("addHints()", function() {
    beforeAll(function() {
      board.init(5);
      board.board = [["","","","","M"],
                     ["","M","","",""],
                     ["","","M","",""],
                     ["","M","","",""],
                     ["M","","","",""]];
    });

    it("correctly adds all hints to board of size 5", function() {
      board.addHints()
      expect(board.board).toEqual([[ 1,  1,  1,  1,"M"],
                                   [ 1, "M", 2,  2, 1 ],
                                   [ 2,  3, "M", 1, 0 ],
                                   [ 2, "M", 2,  1, 0 ],
                                   ["M", 2,  1,  0, 0 ]]);
    });
  });

  describe("isMine(row, col)", function() {
    describe ("with a size 5 board", function() {
      beforeAll(function() {
        board.init(5);
        board.board = [["","","","","M"],
                       ["","M","","",""],
                       ["","","M","",""],
                       ["","M","","",""],
                       ["M","","","",""]];
      });

      it("returns true when given row 0, col 4 that has a mine", function() {
        expect(board.isMine(0, 4)).toBeTruthy();
      });

      it("returns false when given row 0, col 0 that has no mine", function() {
        expect(board.isMine(0, 0)).toBeFalsy();
      });

      it("returns false when given row 4, col 4 that has no mine", function() {
        expect(board.isMine(4, 4)).toBeFalsy();
      });
    });
  });

  describe("renderBoard()", function() {
    beforeEach(function() {
      setUpHTMLFixture();
      board.init(5);
      board.board = [["","","","","M"],
                     ["","M","","",""],
                     ["","","M","",""],
                     ["","M","","",""],
                     ["M","","","",""]];
      $(".board-container").empty();
    });

    it("renders a correct sized 5x5 board to html", function() {
      board.renderBoard();
      expect($(".board tr").length).toEqual(5);
      expect($(".board-square").length).toEqual(25);
    });

    it("renders hints to html", function() {
      board.addHints();
      board.renderBoard();
      expect(board.board[0][0]).toEqual(parseInt($(".board-square[data-row=0][data-col=0]").find("p").text()), 10);
      expect(board.board[3][0]).toEqual(parseInt($(".board-square[data-row=3][data-col=0]").find("p").text()), 10);
    });

    it("renders mines to html", function() {
      board.renderBoard();
      expect(board.board[0][4]).toEqual($(".board-square[data-row=0][data-col=4]").find("p").text());
      expect(board.board[2][2]).toEqual($(".board-square[data-row=2][data-col=2]").find("p").text());
    });
  });

  describe("revealSquare($square)", function() {
    describe ("with a size 5 board", function() {
      beforeEach(function() {
        setUpHTMLFixture();
        board.init(5);
        $(".board-container").empty();
        board.board = [["","","","","M"],
                       ["","M","","",""],
                       ["","","M","",""],
                       ["","M","","",""],
                       ["M","","","",""]];
        board.addHints();
        board.renderBoard();
      });

      it("reveals square at [0,0] to be a 1", function() {
        var $square = $(".board-square[data-row=0][data-col=0]");
        expect($square).not.toHaveClass("revealed");
        board.revealSquare($square);
        expect($square).toHaveClass("revealed");
        expect($square.find("p")).toHaveText("1");
      });

      it("reveals square at [3,0] to be a 2", function() {
        var $square = $(".board-square[data-row=3][data-col=0]");
        expect($square).not.toHaveClass("revealed");
        board.revealSquare($square);
        expect($square).toHaveClass("revealed");
        expect($square.find("p")).toHaveText("2");
      });

      it("reveals square at [2,1] to be a 3", function() {
        var $square = $(".board-square[data-row=2][data-col=1]");
        expect($square).not.toHaveClass("revealed");
        board.revealSquare($square);
        expect($square).toHaveClass("revealed");
        expect($square.find("p")).toHaveText("3");
      });

      it("reveals square at [4,0] to be a mine", function() {
        var $square = $(".board-square[data-row=4][data-col=0]");
        expect($square).not.toHaveClass("revealed");
        board.revealSquare($square);
        expect($square).toHaveClass("revealed");
        expect($square).toHaveClass("mine");
        expect($square.find("p")).toHaveText("M");
      });

      it("reveals square at [4,4] to be empty and reveals surrounding squares" +
         " until non-empty square is found", function() {
        var $square = $(".board-square[data-row=4][data-col=4]");
        var $square2 = $(".board-square[data-row=4][data-col=3]");
        var $square3 = $(".board-square[data-row=3][data-col=4]");
        var $square4 = $(".board-square[data-row=3][data-col=3]");
        var $square5 = $(".board-square[data-row=4][data-col=2]");
        expect($square).not.toHaveClass("revealed");
        expect($square2).not.toHaveClass("revealed");
        expect($square3).not.toHaveClass("revealed");
        expect($square4).not.toHaveClass("revealed");
        expect($square5).not.toHaveClass("revealed");
        board.revealSquare($square);
        expect($square).toHaveClass("revealed");
        expect($square2).toHaveClass("revealed");
        expect($square3).toHaveClass("revealed");
        expect($square4).toHaveClass("revealed");
        expect($square5).toHaveClass("revealed");
        expect($square.find("p")).toHaveText("");
        expect($square2.find("p")).toHaveText("");
        expect($square3.find("p")).toHaveText("");
        expect($square4.find("p")).toHaveText("1");
        expect($square5.find("p")).toHaveText("1");
      });
    });
  });

  describe("quickClear($square))", function() {
    describe ("with a size 5 board", function() {
      beforeEach(function() {
        setUpHTMLFixture();
        board.init(5);
        $(".board-container").empty();
        board.board = [["","","","","M"],
                       ["","M","","",""],
                       ["","","M","",""],
                       ["","M","","",""],
                       ["M","","","",""]];
        board.addHints();
        board.renderBoard();
      });

      it("given revealed [0, 0], if square [1,1] is correctly flagged to be a" + 
         " mine, will reveal all surrounding squares", function() {
          $(".board-square[data-row=1][data-col=1]").addClass("flagged");
          $square1 = $(".board-square[data-row=0][data-col=0]");
          $square2 = $(".board-square[data-row=0][data-col=1]");
          $square3 = $(".board-square[data-row=1][data-col=0]");
          board.revealSquare($square1);
          expect($square2).not.toHaveClass("revealed");
          expect($square3).not.toHaveClass("revealed");
          board.quickClear($square1);
          expect($square2).toHaveClass("revealed");
          expect($square3).toHaveClass("revealed");
      });

      it("given revealed [0, 0], if square [0,1] is incorrectly flagged to be" +
         " a mine, will reveal all surrounding squares, including a mine",
         function() {
          $(".board-square[data-row=0][data-col=1]").addClass("flagged");
          $square1 = $(".board-square[data-row=0][data-col=0]");
          $square2 = $(".board-square[data-row=1][data-col=1]");
          $square3 = $(".board-square[data-row=1][data-col=0]");
          board.revealSquare($square1);
          expect($square2).not.toHaveClass("revealed");
          expect($square3).not.toHaveClass("revealed");
          board.quickClear($square1);
          expect($square2).toHaveClass("revealed");
          expect($square3).toHaveClass("revealed");
          expect($square2.find("p")).toHaveText("M");
      });
    });
  });

  describe("getSurroundingSquareCoords(row, col)", function() {
    describe ("with a size 10 board", function() {
      beforeAll(function() {
        board.init(10);
      });

      it("given row 0, col 0, returns [[0,1], [1,0], [1,1]]", function() {
        var expectedResult = [[0,1],[1,0],[1,1]];
        expect(board.getSurroundingSquareCoords(0, 0)).toEqual(expectedResult);
      });

      it("given row 0, col 9, returns [[0,8], [1,9], [1,8]]", function() {
        var expectedResult = [[0,8],[1,8],[1,9]];
        expect(board.getSurroundingSquareCoords(0, 9)).toEqual(expectedResult);
      });

      it("given row 9, col 0, returns [[8,0], [8,1], [9,1]]", function() {
        var expectedResult = [[8,0],[8,1],[9,1]];
        expect(board.getSurroundingSquareCoords(9, 0)).toEqual(expectedResult);
      });

      it("given row 9, col 9, returns [[8,8], [8,9], [9,8]]", function() {
        var expectedResult = [[8,8],[8,9],[9,8]];
        expect(board.getSurroundingSquareCoords(9, 9)).toEqual(expectedResult);
      });
      it("given row 3, col 3, returns [[2,2], [2,3], [2,4], [3,2], [3,4]," +
         " [4,2], [4,3], [4,4]]", function() {
        var expectedResult = [[2,2],[2,3],[2,4],[3,2],[3,4],[4,2],[4,3],[4,4]];
        expect(board.getSurroundingSquareCoords(3, 3)).toEqual(expectedResult);
      });
    });
  });

  describe("addOrRemoveFlag($square)", function() {
    beforeEach(function() {
      setUpHTMLFixture();
      board.init(10);
    });

    it("given unflagged square [0,0], flags that square", function() {
      $square = $(".board-square[data-row=0][data-col=0]");
      expect($square).not.toHaveClass("flagged");
      board.addOrRemoveFlag($square);
      expect($square).toHaveClass("flagged");
    });

    it("given flagged square [1,1], unflags that square", function() {
      $square = $(".board-square[data-row=1][data-col=1]");
      $square.addClass("flagged");
      expect($square).toHaveClass("flagged");
      board.addOrRemoveFlag($square);
      expect($square).not.toHaveClass("flagged");
    });
  });

});
