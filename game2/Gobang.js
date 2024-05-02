var ScreenWidth = {
    documentWidth: 500,
    containerWidth: 400, 
    cellWidth: 20 
  }
  if (document.documentElement.clientWidth < 500) {
    ScreenWidth.documentWidth = document.documentElement.clientWidth;
    ScreenWidth.containerWidth = ScreenWidth.documentWidth * 0.8;
    ScreenWidth.cellWidth = ScreenWidth.containerWidth * 0.05;
  }
  //常量
  var reg = /\d{1,2}/g;
  var white = []; 
  var black = []; 
  var tempKey = false; // how's turn
  var notOver = true; // games not over
  var tips = "Your turn:"; // tips your turn
  var count = 0;// how many that stick
  var bv = false; // balck win
  var wv = false; // white win 
  var yCanWin = [];// column
  var xCanWin = [];// row
  var xyCanWin = [];// diagonal
  var yxCanWin = [];// diagonal

  // listener monitoring every step
  var time = setInterval(function () {
    if (bv) {
      tips = "Computer WIn!";
      document.getElementsByTagName("span")[0].innerText = tips;
      for (var i = 0; i < document.getElementsByClassName("pieceBox").length; i++) {
        document.getElementsByClassName("pieceBox")[i].onclick = null;
      }
      clearInterval(time);
    }
    if (wv) {
      tips = "You WIN!!";
      document.getElementsByTagName("span")[0].innerText = tips;
      for (var i = 0; i < document.getElementsByClassName("pieceBox").length; i++) {
        document.getElementsByClassName("pieceBox")[i].onclick = null;
      }
      clearInterval(time);
    }
  }, 100);

  newGame();// game start
  function newGame() {
    if (document.getElementsByTagName("table").length) {
      for (var i = 0; i < document.getElementsByTagName("table").length; i++) {
        document.getElementsByTagName("table")[i].remove();
      }
    }
    // initialize
    bgInit();
    pieceInit();
    spanFn();
    white = [];
    black = [];
    tempKey = false;
    notOver = true;
    tips = "your turn:";
    count = 0;
    bv = false;
    xCanWin = [];
    yCanWin = [];
    xyCanWin = [];
    yxCanWin = [];
  }
  
  
  function spanFn() {
    var span = document.createElement("span");
    document.body.insertBefore(span, document.getElementsByTagName("script")[0]);
    span.innerText = tips;
  }
  // board initialize
  function bgInit() {
    var table = document.createElement("table");
    table.className = "box"
    for (var y = 0; y < 20; y++) {
      var tr = document.createElement("tr");
      for (var x = 0; x < 20; x++) {
        var td = "<td class='box-" + y + "-" + x + "' style='width: " + ScreenWidth.cellWidth + "px; height: " + ScreenWidth.cellWidth + "px;border:1px solid #9c9c9c'></td>";
        tr.innerHTML += td;
      }
      table.appendChild(tr);
    }
    document.body.insertBefore(table, document.getElementsByTagName("script")[0]);
  }
  
  
  // piece initialize
  function pieceInit() {
    var table = document.createElement("table");
    table.className = "piece"
    table.style = "position: absolute; top: 0; left:50%; margin-left:-" + (ScreenWidth.containerWidth + 42) / 2 + "px";
    for (var y = 0; y < 20; y++) {
      var tr = document.createElement("tr");
      for (var x = 0; x < 20; x++) {
        var td = "<td class='piece-" + y + "-" + x + " pieceBox' style='width: " + ScreenWidth.cellWidth + "px; height: " + ScreenWidth.cellWidth + "px;border:1px solid transparent;border-radius: 50%;'></td>";
        tr.innerHTML += td;
      }
      table.appendChild(tr);
    }
    document.body.insertBefore(table, document.getElementsByTagName("script")[0]);
  }


  //for the move
  for (var i = 0; i < document.getElementsByClassName("pieceBox").length; i++) {
    document.getElementsByClassName("pieceBox")[i].onclick = function () {
        if (!notOver) return;

        if (!tempKey) {
            //Player's move (white piece)
            this.style.backgroundColor = "#fff"; // White piece
            tempKey = true;
            white.push(this.className.match(reg));
            //Check victory
            victory(white, 1);
            
            //Update the turn and display the message
            if (notOver) {
                document.getElementsByTagName("span")[0].innerText = tipsGo(tempKey);
                
                // Call the computer's move
                computerMove();
            }
        }
        this.onclick = null; //Disable further clicks
    };
}
  
  // 提示走黑还是走白
  function tipsGo(tempKey) {
    if (tempKey) {
      return "Computer:";
    } else {
      return "Your turn:";
    }
  }
  
  
  /*
   Judging the various ways to win
   x for horizontal coordinates, y for vertical coordinates
   1. Vertical win, that is, the x value is the same, take the y value sorted and compared
   2. Horizontal win, that is, the same value of y, take the x value sorted and compared
   3. Skew win, x + y the same value, take x or y sorted and compared
   4. reverse slant win, x-y same value, take x or y sort and compare
   */
  function victory(target, c) {
    if (target.length >= 5) {
      // 1.yCanWin
      for (var i = 0; i < target.length; i++) {
        for (var j = 0; j < target.length; j++) {
          if (target[j][1] == target[i][1]) {
            yCanWin.push(target[j]);
          }
        }
        yWin(yCanWin, c);
        yCanWin = [];
      }
      // 2.xCanWin
      for (var m = 0; m < target.length; m++) {
        for (var n = 0; n < target.length; n++) {
          if (target[n][0] == target[m][0]) {
            xCanWin.push(target[n]);
          }
        }
        xWin(xCanWin, c);
        xCanWin = [];
      }
      
      for (var a = 0; a < target.length; a++) {
        for (var b = 0; b < target.length; b++) {
          if (parseInt(target[b][0]) + parseInt(target[b][1]) == parseInt(target[a][0]) + parseInt(target[a][1])) {
            xyCanWin.push(target[b])
          }
        }
        yWin(xyCanWin, c);
        xyCanWin = [];
      }

      for (var v = 0; v < target.length; v++) {
        for (var w = 0; w < target.length; w++) {
          if (parseInt(target[w][0]) - parseInt(target[w][1]) == parseInt(target[v][0]) - parseInt(target[v][1])) {
            yxCanWin.push(target[w])
          }
        }
        xWin(yxCanWin, c);
        yxCanWin = [];
      }
    }
  }

  function yWin(yCanWin, c) { 
    var sortArray = [];
    for (var i = 0; i < yCanWin.length; i++) {
      sortArray.push(yCanWin[i][0]);
    }
    sortArray.sort(function (x, y) {
      return x - y;
    });

    for (var j = 0; j < sortArray.length; j++) {
      if (sortArray[j + 1]) {
        if (parseInt(sortArray[j]) + 1 == parseInt(sortArray[j + 1])) {
          count++; 
          if (count == 4 && c == 0) {
            bv = true;
            notOver = false;
            return;
          } else if (count == 4 && c == 1) {
            wv = true;
            notOver = false;
            return;
          }
        } else {
          count = 0;
        }
      }
    }
    count = 0;
  }

  function xWin(xCanWin, c) {
    var sortArray = [];
    for (var i = 0; i < xCanWin.length; i++) {
      sortArray.push(xCanWin[i][1]);
    }
    sortArray.sort(function (x, y) {
      return x - y;
    });
    for (var j = 0; j < sortArray.length; j++) {
      if (sortArray[j + 1]) {
        if (parseInt(sortArray[j]) + 1 == parseInt(sortArray[j + 1])) {
          count++;
          if (count == 4 && c == 0) {
            bv = true;
            notOver = false;
            return;
          } else if (count == 4 && c == 1) {
            wv = true;
            notOver = false;
            return;
          }
        } else {
          count = 0;
        }
      }
    }
    count = 0;
  }
  

  function computerMove() {
    if (!notOver) return; //Exit if the game is over

    //Find all empty cells
    const emptyCells = [];
    for (var i = 0; i < 20; i++) {
        for (var j = 0; j < 20; j++) {
            const cellClass = `.piece-${i}-${j}`;
            const cell = document.querySelector(cellClass);
            if (!cell.style.backgroundColor) {
                emptyCells.push(cell);
            }
        }
    }
    
    if (emptyCells.length > 0) {
        //Randomly choose an empty cell for the computer's move
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const selectedCell = emptyCells[randomIndex];
        
        //Make the computer's move
        selectedCell.style.backgroundColor = "#000";
        black.push(selectedCell.className.match(reg));

        victory(black, 0);
        

        if (notOver) {
            tempKey = false;
            document.getElementsByTagName("span")[0].innerText = tipsGo(tempKey);
        }
        selectedCell.onclick = null;
    }
}

