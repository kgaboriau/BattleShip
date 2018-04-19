// Constants definine game tile colours
const _blue = '#392DFF';
const _black = '#000000';
const _red = '#FF0000';
const _grey = '#9B9FB0';

// Variables to define the game board
var rows = 8;
var cols = 8;
var targetTileSize = 50;
var positionTileSize = 20;

// Variables defining players
var currentPlayer;
var player1;
var player2;

//DOM elements
var targetBoardContainer = document.getElementById("targetboard");
var positionBoardContainer = document.getElementById("positionboard");
var feedbackConsole = document.getElementById("systemFeedback");

// Initialize new game
function startGame(){
	player1 = new Player();
	player2 = new Player();

	// Set players' targetBoard layouts equal to opponent's positionBoard
	player1.generateTarget(player2);
	player2.generateTarget(player1);

	// Set current player to player 1
	currentPlayer = player1;

	// Populate DOM for game boards
	buildBoardContainers();

	// Clear console and prompt player for action
	feedbackConsole.innerHTML = '';
	writeToConsole("Fire a shot at your opponent's board by clicking on a blue tile...");

}

// Write message to system feedback console
function writeToConsole(message){
	var feedback = "> " + message;
	var paragraph = document.createElement("p");
	paragraph.textContent += feedback;
	feedbackConsole.appendChild(paragraph);
}

// Updates what the player sees on the screen to reflect game play
function buildBoardContainers(){
	// Make the grids columns and rows
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			
			// create a new div HTML element for each grid square and make it the right size
			var tile = document.createElement("div");
			var staticTile = document.createElement("div");
			targetBoardContainer.appendChild(tile);
			positionBoardContainer.appendChild(staticTile);

	    	// give each div element a unique id based on its row and column, like "s00"
			tile.id = 't' + j + i;	
			staticTile.id = 's' + j + i;
			if (currentPlayer.positionBoard[j][i] == 0){
				staticTile.style.background = _grey;
			} else {
				staticTile.style.background = _black;
			}
			
			// set each grid square's coordinates: multiples of the current row or column number
			var topTarget = j * targetTileSize;
			var leftTarget = i * targetTileSize;	
			var topPosition	= j * positionTileSize;
			var leftPosition = i * positionTileSize;
			
			// use CSS absolute positioning to place each grid square on the page
			tile.style.top = topTarget + 'px';
			tile.style.left = leftTarget + 'px';	
			staticTile.style.top = topPosition + 'px';
			staticTile.style.left = leftPosition + 'px';					
		}
	}
}

// When player is done their turn and clicks the button to allow the next plater to start
function nextTurn(){
	if (currentPlayer == player1){
		currentPlayer = player2;
	} else {
		currentPlayer = player1;
	}

	// Clear console and prompt player for action
	feedbackConsole.innerHTML = '';
	writeToConsole("Fire a shot at your opponent's board by clicking on a blue tile...");

	updateView();
}

/*
* This function takes care of updateing the screen depending on the game state.
* It will need to be called when either the current player is changed, the game has ended, 
* or a player has started their turn.
*/
function updateView(){
	//TODO will need to be updated as game is enhanced

	
	// Iterate over two game boards and update their appearance
	var children = positionBoardContainer.childNodes;
	var childID = null;
	var row = null;
	var col = null;
	for (let i = 0; i < children.length; i++){
		childID = children[i].getAttribute('id');
		row = childID.substring(1,2);
		col = childID.substring(2, 3);

		if (currentPlayer.positionBoard[row][col] == 1){
			children[i].style.background = _black;
		} else {
			children[i].style.background = _grey;
		}
	}

	children = targetBoardContainer.childNodes;
	for (let i = 0; i < children.length; i++){
		childID = children[i].getAttribute('id');
		row = childID.substring(1,2);
		col = childID.substring(2, 3);

		if (currentPlayer.targetBoard[row][col] == 2){
			children[i].style.background = _red;
		} else if (currentPlayer.targetBoard[row][col] == 3) {
			children[i].style.background = _grey;
		} else {
			children[i].style.background = _blue;
		}
	}

}

// Add event listener for shot fired
targetBoardContainer.addEventListener("click", fireShot, false);

// Handle player's move (shot fired on targetBoard)
function fireShot(e) {
	// If item clicked (e.target) is not the parent element on which the event listener was set (e.currentTarget)
	if (e.target !== e.currentTarget) {
        // Extract row and column # from the HTML element's id
		var row = e.target.id.substring(1,2);
		var col = e.target.id.substring(2,3);
		var shot = currentPlayer.targetBoard[row][col];

		/*
		* Handle the possible cases
		* 1. User clicked on square with no ship hidden: square turns grey
		* 2. User clicked on square with ship hidden: square turns red
		* 3. User clicked on square already shot at: do not change turns
		*/
		if (shot == 0) {
			// Miss
			currentPlayer.shotsFired++;
			e.target.style.background = _grey;
			currentPlayer.targetBoard[row][col] = 3;
			writeToConsole("Miss");
		} else if (shot == 1){
			// Hit
			currentPlayer.shotsFired++;
			e.target.style.background = _red;
			currentPlayer.targetBoard[row][col] = 2;
			writeToConsole("Hit");
		} else {
			writeToConsole("Stop wasting missiles, you already fired there...");
		}
	}
	e.stopPropagation();
}

/* Checks that the given position is open on the given board. First
* it will look to see that the ship does not fall outside the 
* boundaries of the board. Then it will ensure that the ship is 
* not placed overtop another ship.
*/
function validateShipPosition(row, col, ship, board){
	var shipTiles = [];
	shipTiles.push(board[row][col]);

	switch (ship.type){
		case 'LShip':
			if (((row + 2) > (board.length - 1)) || ((col + 1) > (board[0].length - 1))) { 
				return false; 
			}

			shipTiles.push(board[row + 1][col]);
			shipTiles.push(board[row + 2][col]);
			shipTiles.push(board[row + 2][col + 1]);
			break;
		case 'SquareShip':
			if (((row + 1) > (board.length - 1)) || ((col + 1) > (board[0].length - 1))) {
				return false;
			}

			shipTiles.push(board[row + 1][col]);
			shipTiles.push(board[row + 1][col + 1]);
			shipTiles.push(board[row][col + 1]);
			break;
		case 'LongShip':
			if ((row + 3) > (board.length - 1)) {
				return false;
			}

			shipTiles.push(board[row + 1][col]);
			shipTiles.push(board[row + 2][col]);
			shipTiles.push(board[row + 3][col]);
			break;
		default:
			//TODO deal with invalid ship type
	}

	for (let i = 0; i < shipTiles.length; i++){
		if (shipTiles[i] != 0) { return false; }
	}

	return true;
}

// Places the given ship on the given game board
function placeShip(ship, board){
	var row = ship.originRow;
	var col = ship.originCol;

	switch (ship.type){
		case 'LShip':
			board[row][col] = 1;
			board[row + 1][col] = 1;
			board[row + 2][col] = 1;
			board[row + 2][col + 1] = 1;
			break;
		case 'SquareShip':
			board[row][col] = 1;
			board[row + 1][col] = 1;
			board[row + 1][col + 1] = 1;
			board[row][col + 1] = 1;
			break;
		case 'LongShip':
			board[row][col] = 1;
			board[row + 1][col] = 1;
			board[row + 2][col] = 1;
			board[row + 3][col] = 1;
			break;
		default:
			//TODO deal with invalid ship type
	}
}

// Generates a random integer given a maximum value
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/*
* Create a new position board. The game board will be a two dimensional integer array. 
* The value of each element in the nested array will represent the state of the tile
* on the game board.
* 0 = tile not yet fired at
* 1 = part of a ship not yet hit
* 2 = part of a ship already hit
* 3 = a missed shot
*/
function generateBoard(ships){
	// Create empty board represented by a two dimensional array
	var gameBoard = [
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0]
	];

	// Iterate over all ships to place on board
	var validatePlacement = false;
	var row = 0;
	var col = 0;

	for (let i =0; i < ships.length; i++){
		// Randomly generate valid placement for ship and set ship position
		do {
			row = getRandomInt(gameBoard.length);
			col = getRandomInt(gameBoard[i].length);
			validatePlacement = validateShipPosition(row, col, ships[i], gameBoard);
		} while (!validatePlacement)


		// Update game board to reflect valid ship placements
		ships[i].originRow = row;
		ships[i].originCol = col;
		placeShip(ships[i], gameBoard);
		validatePlacement = false;
	}


	return gameBoard;
}

/*
* Creates ships for player. Currently game provides four ships in the fleet:
* one L shaped ship with height 3 and width 2 (LShip)
* one square ship with height 2 and width 2 (SquareShip)
* two long ships with height 4 and width 1 (LongShip)
*/
function generateFleet(){
	var fleet = [
	new Ship('LShip'), 
	new Ship('SquareShip'),
	new Ship('LongShip'),
	new Ship('LongShip')
	];

	return fleet;
}

// Class to model player
class Player {
	constructor(){
		this.fleet = generateFleet();
		this.positionBoard = generateBoard(this.fleet);
		this.shotsFired = 0;
		this.targetBoard = null;
	}

	// Sets the player's target board equal to the opponent's position board
	generateTarget(opponent){
		this.targetBoard = [];

		for (let i = 0; i < opponent.positionBoard.length; i++){
			this.targetBoard[i] = opponent.positionBoard[i].slice();
		}
	}
}

// Class to model ship
class Ship {
	constructor(type){
		/*
		* Ship can be one of three types:
		* 1. LShip
		* 2. SquareShip
		* 3. LongShip
		*/
		this.type = type;
		this.originRow = -1;
		this.originCol = -1;
		this.alive = true;
	}
}

