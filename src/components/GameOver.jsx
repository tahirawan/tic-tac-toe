export default function GameOver({ winner, onPlayAgain }) {
    // console.log('winner: ', winner);
    return (
        <div id="game-over">
            <h2>Game over</h2>
            {
                winner ? <p>Player {winner} won!</p>
                : <p>Draw!</p>
            }
                <button className="button" onClick={onPlayAgain}>Play again</button>
        </div>
    );
}
