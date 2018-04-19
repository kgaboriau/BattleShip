// Variables to define the game board
var rows = 8;
var cols = 8;
var targetTileSize = 50;
var positionTileSize = 20;

//TODO Generating the board and adding it to the DOM
var gameBoardContainer = document.getElementById("gameboard");

// make the grid columns and rows
for (let i = 0; i < cols; i++) {
	for (let j = 0; j < rows; j++) {
		
		// create a new div HTML element for each grid square and make it the right size
		var tile = document.createElement("div");
		gameBoardContainer.appendChild(tile);

    // give each div element a unique id based on its row and column, like "s00"
		tile.id = 't' + j + i;			
		
		// set each grid square's coordinates: multiples of the current row or column number
		var topPosition = j * targetTileSize;
		var leftPosition = i * targetTileSize;			
		
		// use CSS absolute positioning to place each grid square on the page
		tile.style.top = topPosition + 'px';
		tile.style.left = leftPosition + 'px';						
	}
}

// Variables defining players
var currentPlayer;

// Initialize new game
function startGame(){
	let player1 = new Player();
	let player2 = new Player();

	// Set players' targetBoard layouts equal to opponent's positionBoard
	player1.targetBoard = player2.positionBoard;
	player2.targetBoard = player1.positionBoard;

	// Set current player to player 1
	currentPlayer = player1;
}

// Add event listener for shot fired
gameBoardContainer.addEventListener("click", fireShot, false);

// Handle player's move (shot fired on targetBoard)
function fireShot(e) {
	// If item clicked (e.target) is not the parent element on which the event listener was set (e.currentTarget)
	if (e.target !== e.currentTarget) {
        // Extract row and column # from the HTML element's id
		var row = e.target.id.substring(1,2);
		var col = e.target.id.substring(2,3);
		var shot = currentPlayer.positionBoard[row][col];

		/*
		* Handle the possible cases
		* 1. User clicked on square with no ship hidden: square turns grey
		* 2. User clicked on square with ship hidden: square turns red
		* 3. User clicked on square already shot at: do not change turns
		*/
		if (shot == 0) {
			// Miss
			e.target.style.background = '#9B9FB0';
			shot = 3;
		} else if (shot == 1){
			// Hit
			e.target.style.background = '#FF0000';
			shot = 2;
		} else {
			//TODO provide message that this is an invalid square
		}
	}
	e.stopPropagation();
}

//TODO Create a new positionBoard *For now this will be simple, later random gen
function generateBoard(){
	/* create the 2d array that will contain the status of each square on the board
	   and place ships on the board (later, create function for random placement!)
	   0 = empty, 1 = part of a ship, 2 = a sunken part of a ship, 3 = a missed shot
	*/
	var gameBoard = [
					[0,0,0,1,1,1,1,0],
					[0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,1,0],
					[0,0,0,0,0,0,1,0],
					[1,0,0,0,0,0,1,1],
					[1,0,0,0,0,0,0,0],
					[1,0,0,1,0,0,0,0]
					];

	return gameBoard;
}

// Class to model player
class Player{
	constructor(){
		this.positionBoard = generateBoard();
	}
}

