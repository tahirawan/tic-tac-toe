import Player from "./components/Player.jsx";
import GameBoard from "./components/GameBoard.jsx";
import {useState} from "react";
import Log from "./components/Log.jsx";
import {WINNING_COMBINATIONS} from "./winning-combinations.js";
import GameOver from "./components/GameOver.jsx";

const PLAYERS = {
    'X': 'Player 1',
    'O': 'Player 2'
}

const INITIAL_GAME_BOARD = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
];

function getRandomPlayer() {
    const playerKeys = Object.keys(PLAYERS);
    const randomIndex = Math.floor(Math.random() * playerKeys.length);

    return playerKeys[randomIndex];
}

function deriveActivePlayer(existingPlayer= null, gameTurns) {

    let currentPlayer = existingPlayer ? existingPlayer : getRandomPlayer();

    if (gameTurns.length > 0 && gameTurns[0].player === currentPlayer) {
        //todo: refactor this logic
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
    }

    return currentPlayer;
}

function deriveGameBoard(gameTurns) {
    let gameBoard = [...INITIAL_GAME_BOARD.map(innerArray => [...innerArray])];

    for (const turn of gameTurns) {
        const {square, player} = turn;
        const {row, col} = square;

        gameBoard[row][col] = player
    }

    return gameBoard;
}

function deriveWinner(gameBoard, players) {
    let winner;

    //deriving winner
    for (const combination of WINNING_COMBINATIONS) {
        // console.log('winner combination: ', winner);
        const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
        const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
        const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

        if (firstSquareSymbol &&
            firstSquareSymbol === secondSquareSymbol &&
            secondSquareSymbol === thirdSquareSymbol
        ) {
            winner = players[firstSquareSymbol];
        }
    }

    return winner;
}

function App() {
    const [players, setPlayers] = useState(PLAYERS)
    const [gameTurns, setGameTurns] = useState([])
    // const [currentPlayer, setCurrentPlayer] = useState(getRandomPlayer)

    let currentPlayer = deriveActivePlayer(null, gameTurns);

    const gameBoard = deriveGameBoard(gameTurns);

    const winner = deriveWinner(gameBoard, players);

    const hasDraw = gameTurns.length === 9 && !winner;

    function resetGame() {
        setGameTurns([]);
    }

    function onToss() {
        setGameTurns([]);
    }

    function handleSelectSquare(rowIndex, colIndex) {

        setGameTurns(prevTurns => {
            const currentPlayerNew = deriveActivePlayer(currentPlayer, prevTurns);


            /*let currentPlayer = 'X';

            if (prevTurns.length > 0 && prevTurns[0].player === 'X') {
                currentPlayer = 'O';
            }*/

            return [
                {square: {row: rowIndex, col: colIndex}, player: currentPlayerNew},
                ...prevTurns
            ];
        })
    }

    function handlerPlayerNameChange(symbol, newName) {
        setPlayers(prevPlayers => {
            return {
                ...prevPlayers,
                [symbol]: newName
            }
        });
    }

    function hasGameStarted() {
        return gameTurns.length > 0;
    }

    return (
        <main>
            <div id="game-container">
                <ol id="players" className="highlight-player">
                    <Player
                        initialName={PLAYERS.X}
                        symbol="X"
                        isActive={currentPlayer === 'X'}
                        onChangeName={handlerPlayerNameChange}
                    />
                    <Player
                        initialName={PLAYERS.O}
                        symbol="O"
                        isActive={currentPlayer === 'O'}
                        onChangeName={handlerPlayerNameChange}
                    />
                </ol>
                <div>
                    <button
                        className="button small"
                        onClick={onToss}
                        disabled={hasGameStarted()}
                    >Toss</button>
                </div>
                {(winner || hasDraw) && <GameOver winner={winner} onPlayAgain={resetGame}/>}
                <GameBoard
                    onSelectSquare={handleSelectSquare}
                    board={gameBoard}/>
            </div>
            <Log turns={gameTurns} players={players}/>
        </main>
    )
}

export default App
