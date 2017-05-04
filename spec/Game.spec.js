
function setUpHTMLFixture() {
  setFixtures('<div class="game-info-wrapper">'
            +   '<div class="flag-count-wrapper">'
            +     '<span>Mines:</span>'
            +     '<span class="flag-count"></span>'
            +   '</div>'
            +   '<div class="timer-wrapper">'
            +     '<span>Time:</span>'
            +     '<span class="time"></span>'
            +   '</div>'
            + '</div>'
            + '<div class="board-wrapper">'
            +   '<div class="board-container">'
            +   '</div>'
            + '</div>'
            + '<div class="gameover-container">'
            +    '<div class="gameover-text"><h2></h2></div>'
            +    '<div class="play-again">'
            +      '<button id="play-again-btn">'
            +         'Play again?'
            +      '</button>'
            +    '</div>'
            + '</div>');
}


describe("Game object", function() {
  beforeEach(function() {
    setUpHTMLFixture();
  });

  describe("init()", function() {
    it("given size 15, initializes a 15x15 board", function() {
      expect($(".board-container")).toBeEmpty();
      game.init(15);
      expect(board.size).toEqual(15);
      expect($(".board-container")).not.toBeEmpty();
    });
  });

  describe("pageText()", function() {
    it("adds flag count and time to page html", function() {
      expect($(".flag-count")).toHaveText("");
      expect($(".time")).toHaveText("");
      game.init(10);
      game.pageText();
      expect($(".flag-count").text()).toEqual("20");
      expect($(".time")).toHaveText("0");
    });

    it("removes any gameover text", function() {
      $(".gameover-text h2").text("gameover");
      game.pageText();
      expect($(".gameover-text h2")).toHaveText("");
    });

    it("hides play again button", function() {
      $("#play-again-btn").show();
      game.pageText();
      expect($("#play-again-btn")).toBeHidden();
    });
  });

  describe("clickSquare()", function() {
    var $square;
    var event;
    var spyEvent;

    beforeEach(function() {
      game.init(10);
    });

    it("successfully triggers on left-click", function() {
      $square = $(".board-square[data-row=0][data-col=0]");
      event = { type: "mousedown",
                which: 1 };
      spyEvent = spyOnEvent($square, "event");
      $square.trigger("event", event);
      expect("event").toHaveBeenTriggeredOnAndWith($square, event);
    });

    it("successfully triggers on right-click", function() {
      $square = $(".board-square[data-row=0][data-col=0]");
      event = { type: "mousedown",
                which: 3 };
      spyEvent = spyOnEvent($square, "event");
      $square.trigger("event", event);
      expect("event").toHaveBeenTriggeredOnAndWith($square, event);
    });
  });

  describe("checkLoss()", function() {
    beforeEach(function() {
      game.init(10);
    });

    it("sets game.lose to true if the player has revealed a mine", function() {
      expect(game.lose).toBeFalsy();
      $squareWithMine = $(".board-square:contains('M')").slice(0,1);
      board.revealSquare($squareWithMine);
      game.checkLoss();
      expect(game.lose).toBeTruthy();
    });

    it("sets game.win to true if the player has won", function() {
      expect(game.win).toBeFalsy();
      $(".board-square").each(function() {
        if ($(this).text() === "M") {
          $(this).addClass("flagged");
        } else {
          $(this).addClass("revealed");
        }
      });
      game.checkWin();
      expect(game.win).toBeTruthy();
    });
  });

  describe("gameoverScreen()", function() {
    beforeEach(function() {
      game.init(10);
    });

    it("if the player lost, renders a loss screen", function() {
      expect($(".gameover-text h2")).not.toHaveText("You lose!");
      expect($("#play-again-btn")).toBeHidden();
      game.lose = true;
      game.gameoverScreen();
      expect($(".gameover-text h2")).toHaveText("You lose!");
      expect($("#play-again-btn")).toBeVisible();
    });

    it("if the player won, renders a win screen", function() {
      expect($(".gameover-text h2")).not.toHaveText("You win!");
      expect($("#play-again-btn")).toBeHidden();
      game.win = true;
      game.gameoverScreen();
      expect($(".gameover-text h2")).toHaveText("You win!");
      expect($("#play-again-btn")).toBeVisible();
    });
  });

  describe("playAgain()", function() {
    var spyEvent;

    beforeEach(function() {
      game.init(10);
    });

    it("successfully triggers when play again button is clicked", function() {
      spyEvent = spyOnEvent("#play-again-btn", "click");
      $("#play-again-btn").trigger("click");
      expect(spyEvent).toHaveBeenTriggered();
    });
  });
});
