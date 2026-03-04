//  HANDLE AUDIO

const bgaudio= document.getElementById("bg-audio");
const winaudio= document.getElementById("winaudio");
const losedrawaudio= document.getElementById("losedrawaudio");
let beepaudio= document.getElementById("beepaudio");
beepaudio.volume= 1.0;
bgaudio.volume= 0.75;
const volume_up= document.getElementsByClassName('sound');

bgaudio.play().catch(() => {
  for(const sound of volume_up) {
  sound.classList.add("off");} });

  for(const sound of volume_up) {
  sound.addEventListener("click", () => {
    if (bgaudio.paused) {
      bgaudio.play();
      for (const s of volume_up) {
        s.classList.remove("off");} }
    else {
      bgaudio.pause();
      for (const s of volume_up) {
        s.classList.add("off");}}
  }); }

function playSFX(audio) {
  try {
  if (!bgaudio.paused) {   
    audio.pause();
    audio.currentTime = 0; 
    audio.play().catch(()=> {});} }
  catch(e) {console.log("SX error:", e);}
}

//  HANDLE ALL POPUPS FROM/ OF HOMEPAGE

const playerNumber= document.getElementsByClassName('playerNumber');
const popupbutton= document.getElementsByClassName('popupButton');
let trackrecordHome= document.getElementById("trackrecordHOME");
let trackrec= document.getElementById('trackRec');
let popupforGame= document.getElementById('popupforgame');
let newGame= document.getElementById('newGame');
let continueGame= document.getElementById('continueGame');
let singleplayMode= document.getElementById('singleplayMode');
let multiplayMode= document.getElementById('multiplayMode');
let singleplayer= document.querySelector('.singleplayer');
let multiplayer= document.querySelector('.multiplayer');
let homePAGE= document.querySelector('.homePage');
let easymode= document.getElementById('easymode');
let mediummode= document.getElementById('mediummode');
let hardmode= document.getElementById('hardmode');
let difficulty= document.querySelector('.difficulty');
let difficultymode= document.getElementsByClassName('difficultymode');
let difficultySelected="easy";
let selectedMODE= null;

for(const player of playerNumber) {
    player.addEventListener('click',()=> {
    document.getElementById('popupforgame').style.visibility="visible";});}

for(const pop of popupbutton) {
    pop.addEventListener('click',()=> {
    document.getElementById('popupforgame').style.visibility="hidden";});}

trackrecordHome.addEventListener('click', ()=> {
   trackrec.style.visibility="visible";});


//  HANDLE MULTIPLAYER GAME LOGIC              //


let lastmove= null;
let gameend=false;
let turn = 'O';
let total_turn = 0;
let winner = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let board_array = new Array(9).fill("E");

function checkwinner() {
   for(let [index0,index1,index2] of winner) {
      if(board_array[index0]!="E" && board_array[index0]===board_array[index1] && board_array[index1]===board_array[index2])
         {return 1;}}
   return 0;}

const multiboard = document.getElementById("multiboard");
let cell= multiboard.querySelectorAll('.cell');
const img1=document.getElementById("girlimg");
const img2=document.getElementById("boyimg");
let girlwin= document.getElementById('girlWin');
let girllost= document.getElementById('girlLost');
let girldraw= document.getElementById('girlDraw');
let boywin= document.getElementById('boyWin');
let boylost= document.getElementById('boyLost');
let boydraw= document.getElementById('boyDraw');
let playerTurn = document.getElementById('playerTurn');
const undobtn= document.getElementById('undo');
let win=document.getElementById('winningmessage');
win.style.color="#ff009d";
win.style.fontSize="25px";
girlimg.style.scale = 1.2;
playerTurn.textContent="O's turn";

// ================== multiplayer game state save/ load ==================
function saveGameState() {
  let gameState = {
    board_array,
    turn,
    total_turn,
    lastmove,
    gameend,
    winMessage: win.textContent,
    playerTurnText: playerTurn.textContent,
    movesHistory: movesHistory};
  localStorage.setItem("ticTacToeGameState", JSON.stringify(gameState));
}
    //to restore game
function loadGameState() {
  let savedState = JSON.parse(localStorage.getItem("ticTacToeGameState"));
  if (!savedState) return false;
  board_array = savedState.board_array;
  turn = savedState.turn;
  total_turn = savedState.total_turn;
  lastmove = savedState.lastmove;
  gameend = savedState.gameend;
  win.textContent = savedState.winMessage || "";
  playerTurn.textContent = savedState.playerTurnText || "O's turn";
  movesHistory = savedState.movesHistory || [];   // ✅ restore movesHistory


  // redraw board
  multiboard.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const newCell = document.createElement("div");
    newCell.className = "cell";
    newCell.id = i;
    newCell.style.display = "flex";
    newCell.style.justifyContent = "center";
    newCell.style.alignItems = "center";
    newCell.style.fontSize = "50px";
    if (board_array[i] !== "E") newCell.textContent = board_array[i];
    multiboard.appendChild(newCell);
  }

  // reattach click handlers
  cell= multiboard.querySelectorAll(".cell");
  cell.forEach((val) => {
    if (!gameend) val.addEventListener("click", printerWrapper);
  });

  // restore images
  if (turn === "O") {
    girlimg.style.scale = 1.2;
    boyimg.style.scale = 1;
  } else {
    girlimg.style.scale = 1;
    boyimg.style.scale = 1.2;
  }

  return true;
}
      //to restore win track
function loadStats() {
   let stats2 = JSON.parse(localStorage.getItem("ticTacToeStats")) || {
      girlWin: 0, girlLost: 0, girlDraw: 0,
      boyWin: 0, boyLost: 0, boyDraw: 0};
}

let globalStats = JSON.parse(localStorage.getItem("ticTacToeStats")) || {
  girlWin: 0, girlLost: 0, girlDraw: 0,
  boyWin: 0, boyLost: 0, boyDraw: 0
};

      // Session stats (reset each reload)
let sessionStats = {
  girlWin: 0, girlLost: 0, girlDraw: 0,
  boyWin: 0, boyLost: 0, boyDraw: 0};

      // Save global stats to localStorage
function saveStats2() {
  localStorage.setItem("ticTacToeStats", JSON.stringify(globalStats));}

      // Update both session & global stats
function updateStats2(result) {
  if (result === "girl") {
    sessionStats.girlWin++;
    sessionStats.boyLost++;
    globalStats.girlWin++;
    globalStats.boyLost++;} 
  else if (result === "boy") {
    sessionStats.boyWin++;
    sessionStats.girlLost++;
    globalStats.boyWin++;
    globalStats.girlLost++;} 
  else if (result === "draw") {
    sessionStats.girlDraw++;
    sessionStats.boyDraw++;
    globalStats.girlDraw++;
    globalStats.boyDraw++;}

  saveStats2();
}

let movesHistory= [];

const printer = (event) => {
   if(gameend) return;
   const element = event.target;
   if(board_array[element.id]==="E") {
      total_turn++;
      lastmove= element.id;
      movesHistory.push(lastmove);
      saveGameState();
      if(turn==="O") {
         girlimg.style.scale = 1; 
         boyimg.style.scale = 1.2;
         playerTurn.textContent = "X's turn";
         element.textContent = "O";
         board_array[element.id] = "O";
         element.style.display = "flex";
         element.style.justifyContent = "center";
         element.style.alignItems = "center";
         element.style.fontSize = "50px";
         saveGameState();
         if (checkwinner()) {
            win.textContent = `${document.getElementById("name1").value} Wins!!!`;
            girlwin.textContent= Number(girlwin.textContent)+1;
            boylost.textContent= Number(boylost.textContent)+1;
            girlimg.style.scale = 1.2; 
            playerTurn.textContent = 'Game Ended';
            playSFX(winaudio);
            updateStats2("girl"); 
            boyimg.style.scale = 1; 
            gameend=true;
            localStorage.removeItem("ticTacToeGameState");
            cell.forEach((val)=> {val.removeEventListener('click', printer);})
            return;}
         turn = "X";}
      else{
         girlimg.style.scale = 1.2; 
         boyimg.style.scale = 1; 
         playerTurn.textContent = "O's turn";
         element.textContent = "X";
         board_array[element.id] = "X";
         element.style.display = "flex";
         element.style.justifyContent = "center";
         element.style.alignItems = "center";
         element.style.fontSize = "50px";
        //  movesHistory.push(id);
         saveGameState();
         if (checkwinner()) {
            win.innerHTML=`${document.getElementById("name2").value} Wins!!!`;
            girllost.textContent= Number(girllost.textContent)+1;
            boywin.textContent= Number(boywin.textContent)+1;
            girlimg.style.scale = 1; 
            boyimg.style.scale = 1.2; 
            playerTurn.textContent = 'Game Ended';
            playSFX(winaudio);
            updateStats2("boy");
            gameend=true;
            localStorage.removeItem("ticTacToeGameState");
            cell.forEach((val)=> {val.removeEventListener('click', printer);})
            return;}
         turn = "O";}
   }
   if(total_turn==9) {
      win.innerHTML = "Match Draw";
      girldraw.textContent=Number(girldraw.textContent)+1;
      boydraw.textContent=Number(boydraw.textContent)+1;
      girlimg.style.scale = 1; 
      boyimg.style.scale = 1;
      playerTurn.textContent="Game Ended";
      playSFX(losedrawaudio);
      updateStats2("draw");
      gameend=true;
      localStorage.removeItem("ticTacToeGameState");
      }
}

       // Wrap printer to save after every move
const printerWrapper = (e) => {
  playSFX(beepaudio);
  printer(e);          
  if (!gameend) {
  saveGameState();}     
};

cell.forEach((val) => val.addEventListener("click", printerWrapper));

      //  multiplayer restart button working
const restart = document.getElementById("restartbutton");
restart.addEventListener('click',()=> {
   const allcell= document.getElementsByClassName('cell');
   Array.from(allcell).forEach((value)=>{value.innerHTML="";})
   turn="O";
   playerTurn.textContent = "O's turn";
   total_turn=0;
   board_array = new Array(9).fill("E");
   girlimg.style.scale = 1.2; 
   boyimg.style.scale = 1;
   lastmove=null;
   win.innerHTML = "";
   gameend=false;
   localStorage.removeItem("ticTacToeGameState");
   cell.forEach((val)=> {val.addEventListener('click', printerWrapper)});
});

      //working of multiplayer undo button
undobtn.addEventListener("click", () => {
   if (movesHistory.length === 0) return;
   if (playerTurn.textContent === "Game Ended") return;

let last1 = movesHistory.pop();   // ✅ get last1 move index
  board_array[last1] = "E";
  document.getElementById(last1).textContent = ""; // ✅ clear correct cell
  total_turn = Math.max(0, total_turn - 1);

  // switch turn back
  if (turn === "O") {
    turn = "X";
    playerTurn.textContent = "X's turn";
    girlimg.style.scale = 1.2;
    boyimg.style.scale = 1;
  } else {
    turn = "O";
    playerTurn.textContent = "O's turn";
    girlimg.style.scale = 1;
    boyimg.style.scale = 1.2;
  }

   saveGameState();
});



//  HANDLE SINGLE PLAYER GAME LOGIC

let movesHistory2 = [];  
const singlecell= document.querySelectorAll("#singleBoard .cell");
const winMsg= document.getElementById('singleWinmsg');
const winEl = document.getElementById("singleWin");
const lostEl = document.getElementById("singleLost");
const drawEl = document.getElementById("singleDraw");
const restartBtn2 = document.querySelector(".singleRestart");
const undoBtn2 = document.querySelector(".singleUndo");
const HUMAN = "X";   
const AI = "O"; 
let board2, current2, gameOver;
const SINGLE_KEY = "singleTicTacToeGame";

        // Save game to localstorage
function saveGameState2() {
  if (gameOver) return; 
  const state = {
    board2,
    current2,
    gameOver,
    movesHistory2,
    winMsg: winMsg.textContent};
  localStorage.setItem(SINGLE_KEY, JSON.stringify(state));
}

        // Load saved singleplayer game
function loadGameState2() {
  const state = JSON.parse(localStorage.getItem(SINGLE_KEY));
  if (!state) return false;
  board2 = state.board2;
  current2 = state.current2;
  gameOver = state.gameOver;
  movesHistory2 = state.movesHistory2 || [];
  winMsg.textContent = state.winMsg;
        // redraw UI 
  singlecell.forEach((c, i) => {
    c.textContent = board2[i] !== "E" ? board2[i] : "";
    c.style.fontSize="60px";
    c.style.display="flex";
    c.style.justifyContent="center";
    c.style.alignItems="center";});
  return true;
}

function clearGameState2() {
  localStorage.removeItem(SINGLE_KEY);
}

        //  get win-lose track from localstorage
if (!localStorage.getItem("tictactoe-stats")) {
  localStorage.setItem("tictactoe-stats", JSON.stringify({ wins: 0, losses: 0, draws: 0 }));}

function init(forceNew= false) {
     if (!forceNew && loadGameState2()) {
    return; }
    board2 = Array(9).fill("E");
    current2 = HUMAN;
    gameOver = false;
    movesHistory2 = [];
    singlecell.forEach(c => c.textContent = "");
    winMsg.textContent = "Your Turn (X)";
    clearGameState2(); 
}

function updateStats(result) {
  let stats = JSON.parse(localStorage.getItem("tictactoe-stats"));
  if (result === "win") stats.wins++;
  else if (result === "loss") stats.losses++;
  else if (result === "draw") stats.draws++;
  localStorage.setItem("tictactoe-stats", JSON.stringify(stats));}

        //human move working
function humanMove(e) {
    playSFX(beepaudio);
    const id = Number(e.target.id);
    if (gameOver || board2[id] !== "E" || current2 !== HUMAN) return;
    board2[id] = HUMAN;
    e.target.textContent = HUMAN;
    e.target.style.fontSize="60px";
    e.target.style.display="flex";
    e.target.style.justifyContent="center";
    e.target.style.alignItems="center";
    movesHistory2.push({player: HUMAN, cell: id});
    if (checkGameEnd(HUMAN)) { clearGameState2(); return; }
    current2 = AI;
    winMsg.textContent = "Computer's Turn (O)";
    saveGameState2(); 
    setTimeout(computerMove, 600);}

        //computer move working
  function computerMove() {
    if (gameOver) return;
    let choice2;
    if (difficultySelected === "easy") {
    choice2 = computerMoveEasy();} 
    else if (difficultySelected === "medium") {
    choice2 = computerMoveMedium();} 
    else {
    choice2 = computerMoveHard();}
    if (choice2 === null) return;

    board2[choice2] = AI;
    document.getElementById(String(choice2).padStart(2,"0")).textContent = AI;
    let bot= document.getElementById(String(choice2).padStart(2,"0"));
    bot.style.fontSize="60px";
    bot.style.display="flex";
    bot.style.justifyContent="center";
    bot.style.alignItems="center";
    movesHistory2.push({player: AI, cell: choice2}); // save move
    if (checkGameEnd(AI)) { clearGameState2(); return;}
    current2 = HUMAN;
    winMsg.textContent = "Your Turn (X)";
    saveGameState2();}

        //game end case handle
  function checkGameEnd(player) {
  for (let combo of winner) {
    if (combo.every(idx => board2[idx] === player)) {
      gameOver = true;
      if(player===HUMAN) {winEl.textContent = +winEl.textContent+1; playSFX(winaudio);}
      else {lostEl.textContent = +lostEl.textContent+1; playSFX(losedrawaudio);}
      winMsg.textContent = player === HUMAN ? "You Win 🎉" : "Computer Wins 🤖";
      updateStats(player === HUMAN ? "win" : "loss"); 
      return true;}}
  if (board2.every(cell => cell !== "E")) {
    gameOver = true;
    winMsg.textContent = "Draw 😐";
    drawEl.textContent = +drawEl.textContent+1;
    playSFX(losedrawaudio);
    updateStats("draw"); 
    return true;}
  return false;
}
        //  EASY MODE HANDLING
function computerMoveEasy() {
  const empty = board2.map((v,i)=> v==="E"?i:null).filter(v=>v!==null);
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random()*empty.length)];
}

        //  MEDIUM MODE HANDLING
function computerMoveMedium() {
  for (let [a,b,c] of winner) {
    if (board2[a]===AI && board2[b]===AI && board2[c]==="E") return c;
    if (board2[a]===AI && board2[c]===AI && board2[b]==="E") return b;
    if (board2[b]===AI && board2[c]===AI && board2[a]==="E") return a;}
  for (let [a,b,c] of winner) {
    if (board2[a]===HUMAN && board2[b]===HUMAN && board2[c]==="E") return c;
    if (board2[a]===HUMAN && board2[c]===HUMAN && board2[b]==="E") return b;
    if (board2[b]===HUMAN && board2[c]===HUMAN && board2[a]==="E") return a;}
  return computerMoveEasy();
}

        //  HARD MODE HANDLING
function minimax(newBoard, isMaximizing) {
  if (checkWinnerMini(newBoard, AI)) return 1;
  if (checkWinnerMini(newBoard, HUMAN)) return -1;
  if (!newBoard.includes("E")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i=0; i<9; i++) {
      if (newBoard[i]==="E") {
        newBoard[i] = AI;
        let score = minimax(newBoard, false);
        newBoard[i] = "E";
        bestScore = Math.max(bestScore, score);}}
    return bestScore;} 
  else {
    let bestScore = Infinity;
    for (let i=0; i<9; i++) {
      if (newBoard[i]==="E") {
        newBoard[i] = HUMAN;
        let score = minimax(newBoard, true);
        newBoard[i] = "E";
        bestScore = Math.min(bestScore, score);}}
    return bestScore;}
}

function checkWinnerMini(b, player) {
  return winner.some(pattern => pattern.every(idx => b[idx] === player));
}

function computerMoveHard() {
  let bestScore = -Infinity;
  let move = null;
  for (let i=0; i<9; i++) {
    if (board2[i]==="E") {
      board2[i] = AI;
      let score = minimax(board2, false);
      board2[i] = "E";
      if (score > bestScore) {
        bestScore = score;
        move = i;}}}
  return move;
}


      // single player undo handling
  function undo2() {
    if (gameOver || movesHistory2.length === 0) return;
    let last = movesHistory2.pop();
    if (last.player === HUMAN) {
        board2[last.cell] = "E";
        document.getElementById(String(last.cell).padStart(2,"0")).textContent = "";
        current2 = HUMAN;
        winMsg.textContent = "Your Turn (X)";} 
    else {
        board2[last.cell] = "E";
        document.getElementById(String(last.cell).padStart(2,"0")).textContent = ""; 
        if (movesHistory2.length > 0) {
            let prev = movesHistory2.pop();
            if (prev.player === HUMAN) {
                board2[prev.cell] = "E";
                document.getElementById(String(prev.cell).padStart(2,"0")).textContent = ""; }}
        current2 = HUMAN;
        winMsg.textContent = "Your Turn (X)";}
    saveGameState2();
  }

      //  single player buttons handling
  singlecell.forEach(c => c.addEventListener("click", humanMove));
  restartBtn2.addEventListener("click", init);
  undoBtn2.addEventListener("click", undo2);
  init();


// TRACK RECORD       

let stats= JSON.parse(localStorage.getItem("tictactoe-stats")) || {wins:0, losses:0, draws:0};
document.getElementById('spwin').textContent= stats.wins;
document.getElementById('splose').textContent= stats.losses;
document.getElementById('spdraw').textContent= stats.draws;

let stats2= JSON.parse(localStorage.getItem("ticTacToeStats")) || {girlWin:0, girlLost:0, girlDraw:0, boyWin:0, boyLost:0, boyDraw:0};
document.getElementById('mpxwin').textContent= stats2.boyWin;
document.getElementById('mpxlose').textContent= stats2.boyLost;
document.getElementById('mpxdraw').textContent= stats2.boyDraw;
document.getElementById('mpowin').textContent= stats2.girlWin;
document.getElementById('mpolose').textContent= stats2.girlLost;
document.getElementById('mpodraw').textContent= stats2.girlDraw;


//       PAGE ONCLICKS

let recordexit= document.getElementsByClassName("recordexit");

for(const exit of recordexit) {
   exit.addEventListener('click',()=> {
   trackrec.style.visibility="hidden";
   singleplayer.style.visibility = "hidden";
   multiplayer.style.visibility = "hidden";
   homePAGE.style.visibility="visible";});}

singleplayer.style.visibility = "hidden";
multiplayer.style.visibility = "hidden";
popupforGame.style.visibility = "hidden";

singleplayMode.addEventListener("click", ()=> {
   selectedMODE= "single";
   popupforGame.style.visibility="visible";});
easymode.addEventListener("click", ()=> {
  difficultySelected= "easy";
  difficulty.style.visibility="hidden";
})
mediummode.addEventListener("click", ()=> {
  difficultySelected= "medium";
  difficulty.style.visibility="hidden";
})
hardmode.addEventListener("click", ()=> {
  difficultySelected= "hard";
  difficulty.style.visibility="hidden";
})

multiplayMode.addEventListener("click", ()=> {
   selectedMODE= "multi";
   popupforGame.style.visibility="visible";});

newGame.addEventListener("click", ()=> {
   popupforGame.style.visibility="hidden";
   if (selectedMODE === "single") {
    difficulty.style.visibility="visible";
    for(let difficult of difficultymode) {
      difficult.addEventListener("click",()=> {
    singleplayer.style.visibility="visible";
    multiplayer.style.visibility="hidden";
    homePAGE.style.visibility="hidden";
    localStorage.removeItem(SINGLE_KEY);
    winEl.textContent="0";
    lostEl.textContent= "0";
    drawEl.textContent= "0";
    init(true);}, { once: true });} }
   else if (selectedMODE === "multi") {
    multiplayer.style.visibility="visible";
    singleplayer.style.visibility="hidden";
    homePAGE.style.visibility="hidden";
    localStorage.removeItem("ticTacToeGameState"); // purana game clear
    boylost.textContent= "0";
    girlwin.textContent= "0";
    boywin.textContent= "0";
    girllost.textContent= "0";
    boydraw.textContent= "0";
    girldraw.textContent= "0";
    restart.click(); }
})


continueGame.addEventListener("click", ()=> {
   popupforGame.style.visibility="hidden";
   if (selectedMODE === "single") {
    singleplayer.style.visibility="visible";
    multiplayer.style.visibility="hidden";
    homePAGE.style.visibility="hidden";
    const loaded = loadGameState2();
    if (!loaded) alert("⚠ No saved game found!");} 
   else if (selectedMODE === "multi") {
    multiplayer.style.visibility="visible";
    singleplayer.style.visibility="hidden";
    homePAGE.style.visibility="hidden";
    const loaded = loadGameState();
    if (!loaded) alert("⚠ No saved game found!"); }
})

document.getElementById('exitdifficulty').addEventListener("click",()=> {
  difficulty.style.visibility="hidden";})

//  THEMES HANDLING

let allthemes= document.querySelector('.themes');
let playingmodeTheme= document.getElementById("playingmodeTheme");
playingmodeTheme.addEventListener('click',()=> {
  allthemes.style.visibility="visible";});

window.addEventListener("click", function(event) {
  if (!allthemes.contains(event.target) && event.target !== playingmodeTheme) {
    allthemes.style.visibility = "hidden";};});

const manythemes = ["theme1", "theme2", "theme3", "theme4", "theme5", "theme6"];
let selectedTheme = null; 

document.querySelectorAll(".difftheme").forEach(themeBox => {
  themeBox.addEventListener("click", () => {
    document.querySelectorAll(".difftheme").forEach(box => box.classList.remove("selected"));
    themeBox.classList.add("selected");
    selectedTheme = manythemes.find(t => themeBox.classList.contains(t));});
});

      // APPLY theme button
document.querySelector(".applytheme").addEventListener("click", () => {
  if (selectedTheme) {
    document.body.classList.remove(...manythemes, "dark-mode");
    homePAGE.classList.remove(...manythemes, "dark-mode");
    multiplayer.classList.remove(...manythemes, "dark-mode");
    singleplayer.classList.remove(...manythemes, "dark-mode");
    document.body.classList.add(selectedTheme);
    homePAGE.classList.add(selectedTheme);
    multiplayer.classList.add(selectedTheme);
    singleplayer.classList.add(selectedTheme);
    allthemes.style.visibility="hidden";}
});

// DARK MODE TOGGLE

let modetoggle= document.getElementsByClassName('darkmode');
for(const moding of modetoggle) {
  moding.addEventListener("click",()=> {
  document.body.classList.toggle("dark-mode");}
);}