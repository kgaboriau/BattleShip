# Battle Ship

<b>UML Class Diagram:</b>
![alt text](https://github.com/kgaboriau/BattleShip/blob/master/classUML.png)


<b>Abstract:</b></br>
This was my first attempt at a JS application. In fact, this was my first real JS project. For that reason my code may look a little more like Java than JS. When building this application my first priority was to ensure all game requirements were met and that the code structure was sound with OO principles in mind. I wanted to ensure the code would be easy to refactor as I was learning the language on the fly. Once the core functionality was in place, I split my attention between UI design and application of JS principles. I am very proud of my first JS application and I hope you enjoy playing it as much as I enjoyed writting it. Below I have noted some personal reflection on my skills aquired and potential future focus for the project. Any constructive criticism is more than welcome!


<b>Game Requirements:</b> 
- Game state saved on browser refresh
- Implement standard battleship game play
- Player\'s fleet consists of 4 ships: L shape (3 tall, 2 wide at boot), block (2x2), two lines (4x1)
- The ships are randomly placed on the grid to start
- It should have a lobby with a start button to start the game
- The game is turn based, so player 1 only sees their grid and their shots in player 2's water with their hits and sunk ships. When it is player 2's turn, they see their grid and ships, and player 1's water with their hits and sunk ships
- There should be a UI component to switch between players (ie. Player 2's turn next, with a button to confirm start)
- A move should involve firing a shot by clicking on other player's grid, and if on a boat, hitting it
- If a boat has been hit on each grid space, it is sunk
- The player who fired the shot should be informed if a shot hits or misses, and also should be informed if they have sunk a ship, and if so, what ship has been sunk
- The game should have a reset button to restart to the "lobby" state (beginning of game with no state)
- The game should switch to an end state if one team loses all their ships. The end game state should show who won, total shots fired, ships sunk for both players, and include a restart button


<b>Assumptions Made:</b> 
- The ships cannot be rotated on the grid
- Grid size will not change (constant 8x8)
- The game end statistics are only interested in number of ships sunk not names of ships sunk

<b>New Skills Aquired:</b> 
- JS language structure
- Importing other js projects from gitHub
- Relationship between, JS, DOM, and CSS
- Using cookies


<b>If I had more time: </b>
- More focus on UI design (wanted to look into Vue.js)
- Read more about Sass
- Refactor to allow user input for player names
- Adding the ability to design the game\'s fleet would be interesting
