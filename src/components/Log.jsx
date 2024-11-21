export default function Log({ turns, players }) {
    return (
        <ol id="log">
            { turns.map((turn, turnIndex) =>
                <li key={`${turn.square.row}${turn.square.col}`}>
                    { players[turn.player] } with [{turn.player}] selected {turn.square.row}, {turn.square.col}
                </li>
            )}

        </ol>
    );
}
