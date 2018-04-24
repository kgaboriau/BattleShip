//IIFE
(function mainIIFE() {
// Declare strict mode
"use strict";

// Constants definine game tile colours
const _blue = '#392DFF';
const _black = '#000000';
const _red = '#FF0000';
const _grey = '#9B9FB0';

// Variables defining players and game state
var game;

// Capture page re-load and save game state
window.onbeforeunload = function () {
	var P1Fleet = [];
	var P2Fleet = [];

	// Stringify ships from both player's fleets
	for (let i = 0; i < game.player1.fleet.length; i++){
		P1Fleet.push(JSON.Stringify(game.player1.fleet[i]));
		P2Fleet.push(JSON.Stringify(game.player2.fleet[i]));
	}
	localStorage.setItem("P1Fleet", JSON.stringify(P1Fleet));
	localStorage.setItem("P2Fleet", JSON.stringify(P2Fleet));

	// Stringify remaining player details
	localStorage.setItem("P1Name", game.player1.name);
	localStorage.setItem("P2Name", game.player2.name);
	localStorage.setItem("P1Board", JSON.stringify(game.player1.positionBoard));
	localStorage.setItem("P2Board", JSON.stringify(game.player2.positionBoard));

	// Stringify game state details
	localStorage.setItem("GCurrentPlayer", game.currentPlayer.name);
	localStorage.setItem("GShotFired", JSON.stringify(game.shotFired));
	//localStorage.setItem("GGameOver", );
};

// Initialize new game
function startGame(){
	// Check if page was reloaded, if so set game to saved state from local storage
	if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
		//var P1 = new Player(localStorage.getItem("P1Name"), localStorage.getItem("P1Fleet"), JSON.parse(localStorage.getItem("P1Board")));
		//var P2 = new Player(localStorage.getItem("P2Name"), localStorage.getItem("P2Fleet"), JSON.parse(localStorage.getItem("P2Board")));
		var test = localStorage.getItem("P1Board");
		//var gameOver = ;
		//var curP = ;

		//game = new Game(P1, P2, shotFired, gameOver, curP);
		console.log(test);
		//console.log(P2);
	} else {
		game = new Game();

		// Clear console and prompt player for action
		writeToConsole("Fire a shot at your opponent's board by clicking on a blue tile...", true);
	}

	/*
	* Populate DOM for game boards and update view.
	* buildBoardContainers asks for the following parameters (in order):
	* number of rows on board
	* number of colums on board
	* size of target board tiles (should match value in css)
	* size of position board tiles (should match value in css)
	*/
	buildBoardContainers(8, 8, 50, 20);
	updateView();

}

/*
* This function takes care of updateing the screen depending on the game state.
* It will need to be called when either the current player is changed, the game has ended, 
* or a player has started their turn.
*/
function updateView(){
	// DOM optional controls
	var cover = document.getElementById("cover");
	var coverControls = document.getElementById("coverControls");
	var stats = document.getElementById("stats");
	var passToNextPlayerBtn = document.getElementById("nextPlayer");

	// Check which state the game is in
	if (game.gameOver){
		// Game is over
		GameOver();

	} else {
		// Hide end stats
		stats.style.display = 'none';

		// Check if cover should be shown or boards should be shown
		if (game.shotFired){
			// Shot was fired, waiting for current player to end turn
			// Enable button to end turn
			passToNextPlayerBtn.disabled = false;

		} else {
			// Current player ended their turn, waiting for next player to start
			// Hide game board
			cover.style.display = 'none';
			coverControls.style.display = 'block';

			// Disable button to end turn
			passToNextPlayerBtn.disabled = true;

			// Show next player JQuery
			$('#playerSummon').text(game.currentPlayer.name + ' ready?');

			updateBoards();
		}
	}

}

// Function called when game is over
function GameOver(){
	var cover = document.getElementById("cover");
	var coverControls = document.getElementById("coverControls");
	var turnControl = document.getElementById('turnControl');
	var stats = document.getElementById("stats");

	// Update stats to display
	updateStats(stats);

	// Hide game board and show end stats
	cover.style.display = 'none';
	coverControls.style.display = 'block';
	turnControl.style.display = 'none';
	stats.style.display = 'block';

	// Tell player's who won
	$('#playerSummon').text(((game.player2.shipsSunk() == game.player2.fleet.length) ?
	game.player1.name : game.player2.name) + ' won!');
}

//TODO (MAKE THIS PRETTIER) Updates the DOM to display game over stats
function updateStats(stats){
	// Clear content
	while (stats.firstChild) {
    	stats.removeChild(stats.firstChild);
	}

	// Write new content
	var shots = document.createElement("p");
	var kills = document.createElement("p");

	stats.appendChild(shots);
	stats.appendChild(kills);

	shots.textContent = "Shots Fired:\n" + game.player1.name + ": " + game.player1.shotsFired() + "\n" +
	game.player2.name + ": " + game.player2.shotsFired();
	kills.textContent = "Ships Sunk:\n" + game.player1.name + ": " + game.player2.shipsSunk() + "\n" + 
	game.player2.name + ": " + game.player1.shipsSunk();

}

// Iterate over two game boards and update their appearance
function updateBoards(){
	var positionBoardContainer = document.getElementById("positionboard");
	var children = positionBoardContainer.childNodes;
	var childID = null;
	var row = null;
	var col = null;
	
	for (let i = 0; i < children.length; i++){
		childID = children[i].getAttribute('id');
		row = childID.substring(1,2);
		col = childID.substring(2, 3);

		children[i].style.background = 
		((game.currentPlayer.positionBoard[row][col] == 1) || (game.currentPlayer.positionBoard[row][col] == 2)) ? _black : _grey;
	}

	children = targetBoardContainer.childNodes;
	for (let i = 0; i < children.length; i++){
		childID = children[i].getAttribute('id');
		row = childID.substring(1,2);
		col = childID.substring(2, 3);

		if (game.opponent.positionBoard[row][col] == 2){
			children[i].style.background = _red;
		} else if (game.opponent.positionBoard[row][col] == 3) {
			children[i].style.background = _grey;
		} else {
			children[i].style.background = _blue;
		}
	}
}

// Write message to system feedback console
function writeToConsole(message, clearConsole){
	var feedbackConsole = document.getElementById("systemFeedback");
	var feedback = "> " + message;
	var paragraph = document.createElement("p");

	// Clear console if necessary
	if (clearConsole){
		while (feedbackConsole.firstChild) {
	    	feedbackConsole.removeChild(feedbackConsole.firstChild);
		}
	}

	// Write given message to console
	paragraph.textContent += feedback;
	feedbackConsole.appendChild(paragraph);

	// Set focus to bottom of scrollable console
	feedbackConsole.scrollTop = feedbackConsole.scrollHeight;
}

/************** Event Listeners and corresponding functions **************/

// DOM elements requiring listeners
var targetBoardContainer = document.getElementById("targetboard");
var endTurnBtn = document.getElementById("nextPlayer");
var startTurnBtn = document.getElementById("turnControl");

// Event Listener for target board
targetBoardContainer.addEventListener("click", fireShot, false);

// Event listener for end turn button
endTurnBtn.addEventListener("click", function (){
	game.endTurn();
	writeToConsole("Fire a shot at your opponent's board by clicking on a blue tile...", true);
	updateView();
});

// Event listener for start turn button
startTurnBtn.addEventListener("click", function (){
	var cover = document.getElementById("cover");
	var coverControls = document.getElementById("coverControls");
	// Show game board
	cover.style.display = 'block';
	coverControls.style.display = 'none';
	// Show current player JQuery
	$('#displayPlayer').text('Current Player is: ' + game.currentPlayer.name);
});

// Handle player's move (shot fired on targetBoard)
function fireShot(e) {
	// Validate that the currentPlayer is allowed to shoot and has not already executed a valid shot
	if (!game.shotFired){

		// If item clicked (e.target) is not the parent element on which the event listener was set (e.currentTarget)
		if (e.target !== e.currentTarget) {
	        // Extract row and column # from the HTML element's id
			var row = e.target.id.substring(1,2);
			var col = e.target.id.substring(2,3);
			var shot = game.opponent.positionBoard[row][col];

			/*
			* Handle the possible cases
			* 1. User clicked on square with no ship hidden: square turns grey
			* 2. User clicked on square with ship hidden: square turns red
			* 3. User clicked on square already shot at: do not change turns
			*/
			if ((shot == 0) || (shot == 1)) {
				// Valid shot
				var target = e.target;
				validShot(shot, target, row, col);

				// Update Page to reflect action
				updateView();

			} else {
				// Invalid shot
				writeToConsole("Stop wasting missiles, you already fired there...");
			}
		}

	} else {
		// Current Player has already executed a valid shot and cannot shoot again
		writeToConsole("You have already fired. Pass the game to your opponent by clicking the End Turn button.");
	}
	e.stopPropagation();
}

// Handles the player's shot if it was valid
function validShot(shot, target, row, col){
	game.shotFired = true;

	if (shot){
		// Hit
		writeToConsole("Hit");
		target.style.background = _red;
		game.opponent.positionBoard[row][col] = 2;

		// Check if ship is sunk and if game is over
		manageHit(row, col);

	} else {
		// Miss
		target.style.background = _grey;
		game.opponent.positionBoard[row][col] = 3;
		writeToConsole("Miss");
	}

}

// Handles case where player has hit opponenet's ship
function manageHit(row, col){

	//Change ship's alive state to false if necessary
	for (let i = 0; i < game.opponent.fleet.length; i++){
		for (let j = 0; j < game.opponent.fleet[i].tiles.length; j++){
			if ((row == game.opponent.fleet[i].tiles[j][0]) && (col == game.opponent.fleet[i].tiles[j][1])){
				// Found ship that was hit
				checkLife(game.opponent.fleet[i], game.opponent.positionBoard);

				if (!game.opponent.fleet[i].alive) {
					writeToConsole("You have sunk your opponent's " + game.opponent.fleet[i].name + " ship. " 
						+ "Only " + (game.opponent.fleet.length - game.opponent.shipsSunk()) + " more to go!");
				}
			}
		}
	}
}



// Checks if all ship tiles are hit. Changes alive attribute accordingly.
function checkLife(ship, board){
	for (let i = 0; i < ship.tiles.length; i++){
		if (board[ship.tiles[i][0]][ship.tiles[i][1]] == 2) {
			ship.alive = false;
		} else {
			ship.alive = true;
			break;
		}
	}
}

/************** Functions used for game build **************/

/*
* Creates ships for player. Currently game provides four ships in the fleet:
* one L shaped ship with height 3 and width 2 (LShip)
* one square ship with height 2 and width 2 (SquareShip)
* two long ships with height 4 and width 1 (LongShip)
*/
function generateFleet(){
	var fleet = [
	new Ship('LShip', "Elle"), 
	new Ship('SquareShip', "Quadratum"),
	new Ship('LongShip', "Thing One"),
	new Ship('LongShip', "Thing Two")
	];

	return fleet;
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

		validatePlacement = false;
	}


	return gameBoard;
}

// Generates a random integer given a maximum value
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
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

	// Validation
	for (let i = 0; i < shipTiles.length; i++){
		if (shipTiles[i] != 0) { return false; }
	}

	// Placement is valid, place ship on board
	placeShip(row, col, ship, board);
	return true;
}

// Places the given ship on the given game board and update ship's tiles array
function placeShip(row, col, ship, board){
	var tiles = ship.tiles;

	switch (ship.type){
		case 'LShip':
			board[row][col] = 1;
			board[row + 1][col] = 1;
			board[row + 2][col] = 1;
			board[row + 2][col + 1] = 1;
			tiles.push([row, col]);
			tiles.push([row + 1, col]);
			tiles.push([row + 2, col]);
			tiles.push([row + 2, col + 1]);
			break;
		case 'SquareShip':
			board[row][col] = 1;
			board[row + 1][col] = 1;
			board[row + 1][col + 1] = 1;
			board[row][col + 1] = 1;
			tiles.push([row, col]);
			tiles.push([row + 1, col]);
			tiles.push([row + 1, col + 1]);
			tiles.push([row, col + 1]);
			break;
		case 'LongShip':
			board[row][col] = 1;
			board[row + 1][col] = 1;
			board[row + 2][col] = 1;
			board[row + 3][col] = 1;
			tiles.push([row, col]);
			tiles.push([row + 1, col]);
			tiles.push([row + 2, col]);
			tiles.push([row + 3, col]);
			break;
		default:
			//TODO deal with invalid ship type
	}
}

// Updates DOM to display player's game boards
function buildBoardContainers(rows, cols, targetTileSize, positionTileSize){
	var positionBoardContainer = document.getElementById("positionboard");
	
	// Make the grids columns and rows
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			
			// create a new div HTML element for each grid square and make it the right size
			var tile = document.createElement("div");
			var staticTile = document.createElement("div");
			targetBoardContainer.appendChild(tile);
			positionBoardContainer.appendChild(staticTile);

			// Set width and height of tile
			tile.style.width = targetTileSize + 'px';
			tile.style.height = targetTileSize + 'px';
			staticTile.style.width = positionTileSize + 'px';
			staticTile.style.height = positionTileSize + 'px';

	    	// give each div element a unique id based on its row and column, like "s00"
			tile.id = 't' + j + i;	
			staticTile.id = 's' + j + i;
			if (game.currentPlayer.positionBoard[j][i] == 0){
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

/************** These are the classes to model the game **************/

// Class to model game instance (used for save state)
class Game {
	constructor(P1 = new Player('Player 1'), P2 = new Player('Player 2'), shotFired = false, gameOver = false, curP){
		this.player1 = P1;
		this.player2 = P2;
		this.shotFired = shotFired;
		this.gameOver = gameOver;
		this.currentPlayer = (curP == this.player2.name) ? this.player2 : this.player1;
		this.opponent = (this.currentPlayer == this.player1) ? this.player2 : this.player1;
	}

	checkGameOver(){
		if ((this.player1.shipsSunk() == this.player1.fleet.length) || (this.player2.shipsSunk() == this.player2.fleet.length)) {
			this.gameOver = true;
		} 

		return this.gameOver;
	}

	endTurn(){
		if (this.currentPlayer == this.player1){
			this.currentPlayer = this.player2;
			this.opponent = this.player1;
		} else {
			this.currentPlayer = this.player1;
			this.opponent = this.player2;
		}

		this.shotFired = false;
	}

}

// Class to model player
class Player {
	constructor(name, fleet, posBoard){
		this.fleet = (fleet) ? function (){
			var tempFleet = JSON.parse(fleet);
			for (let i = 0; i < tempFleet.length; i++){
				var ship = new Ship(JSON.parse(tempFleet[i]));
				this.fleet.push(ship);
			}
		} : generateFleet();
		this.positionBoard = (posBoard) ? posBoard : generateBoard(this.fleet);
		this.name = name;
	}

	// Returns the number of ships in fleet that have been sunk
	shipsSunk(){
		var sunk = 0;
		for (let i = 0; i < this.fleet.length; i++){
			if (!this.fleet[i].alive) { sunk += 1; }
		}
		return sunk;
	}

	// Count number of shots fired
	shotsFired(){
		var counter = 0;

		for (let i = 0; i < game.opponent.positionBoard.length; i++){
			for (let j = 0; j < game.opponent.positionBoard[i].length; j++){
				if ((game.opponent.positionBoard[i][j] == 2) || (game.opponent.positionBoard[i][j] == 3)){
					counter++;
				}
			}
		}

		return counter;
	}
}

// Class to model ship
class Ship {
	constructor(type, name, alive = true, tiles = []){
		/*
		* Ship can be one of three types:
		* 1. LShip
		* 2. SquareShip
		* 3. LongShip
		*/
		this.type = type;
		this.name = name;
		this.alive = alive;
		this.tiles = tiles;
	}

}

startGame();
// End IIFE
}) ();