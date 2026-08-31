import { NativeFlowBuilder } from '../../interactions/NativeFlowBuilder.js';
export class TicTacToeGame {
    static createInitialState(playerX, playerO) {
        return {
            board: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            playerX,
            playerO,
            winner: null,
            turn: 'X'
        };
    }
    static handleMove(state, playerJid, index) {
        if (state.winner || index < 0 || index > 8 || state.board[index] !== ' ') {
            return state;
        }
        const currentTurnJid = state.turn === 'X' ? state.playerX : state.playerO;
        if (playerJid !== currentTurnJid && state.playerO !== 'BOT') {
            return state;
        }
        const newBoard = [...state.board];
        newBoard[index] = state.turn;
        const winner = this.checkWinner(newBoard);
        let nextTurn = state.turn === 'X' ? 'O' : 'X';
        // If next turn is BOT and game isn't over, execute bot move
        if (!winner && state.playerO === 'BOT' && nextTurn === 'O') {
            const emptyIndices = newBoard
                .map((val, idx) => (val === ' ' ? idx : null))
                .filter((val) => val !== null);
            if (emptyIndices.length > 0) {
                const botPick = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                newBoard[botPick] = 'O';
                const botWinner = this.checkWinner(newBoard);
                return {
                    board: newBoard,
                    playerX: state.playerX,
                    playerO: state.playerO,
                    winner: botWinner,
                    turn: 'X'
                };
            }
        }
        return {
            board: newBoard,
            playerX: state.playerX,
            playerO: state.playerO,
            winner,
            turn: nextTurn
        };
    }
    static checkWinner(board) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (const [a, b, c] of lines) {
            if (board[a] !== ' ' && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // 'X' or 'O'
            }
        }
        if (board.every((cell) => cell !== ' ')) {
            return 'tie';
        }
        return null;
    }
    static render(state) {
        const emojis = {
            ' ': '⬜',
            X: '❌',
            O: '⭕'
        };
        let boardText = `🎮 *TIC-TAC-TOE SHOWDOWN* 🕹️\n`;
        boardText += `━━━━━━━━━━━━━━━━━━━━━\n`;
        boardText += `Player ❌: @${state.playerX.split('@')[0]}\n`;
        boardText += `Player ⭕: ${state.playerO === 'BOT' ? '🤖 CHAMA AI' : '@' + state.playerO.split('@')[0]}\n`;
        boardText += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
        boardText += ` 1️⃣ | 2️⃣ | 3️⃣        ${emojis[state.board[0]]} ┆ ${emojis[state.board[1]]} ┆ ${emojis[state.board[2]]}\n`;
        boardText += `---+---+---       ---+---+---\n`;
        boardText += ` 4️⃣ | 5️⃣ | 6️⃣   ➡️   ${emojis[state.board[3]]} ┆ ${emojis[state.board[4]]} ┆ ${emojis[state.board[5]]}\n`;
        boardText += `---+---+---       ---+---+---\n`;
        boardText += ` 7️⃣ | 8️⃣ | 9️⃣        ${emojis[state.board[6]]} ┆ ${emojis[state.board[7]]} ┆ ${emojis[state.board[8]]}\n\n`;
        if (state.winner) {
            if (state.winner === 'tie') {
                boardText += `🤝 *GAME OVER: It's a TIE!*`;
            }
            else {
                const winnerName = state.winner === 'X' ? state.playerX : state.playerO;
                boardText += `🏆 *WINNER: ${state.winner === 'X' ? '❌' : '⭕'} (@${winnerName.split('@')[0]})!* 🎉`;
            }
        }
        else {
            boardText += `⏳ *Turn:* ${state.turn === 'X' ? '❌ Player X' : '⭕ Player O'}`;
        }
        const buttons = new NativeFlowBuilder();
        if (!state.winner) {
            // Add buttons for available moves
            for (let i = 0; i < 9; i++) {
                if (state.board[i] === ' ') {
                    buttons.addQuickReply(`Box ${i + 1}`, `ttt_move_${i}`);
                }
            }
        }
        else {
            buttons.addQuickReply('🔄 New Game', 'start_game_tictactoe');
        }
        return {
            title: 'Tic-Tac-Toe',
            displayBoard: boardText,
            footer: 'CHAMA Game Engine',
            buttons: buttons.build().slice(0, 5) // WhatsApp supports up to 5-10 buttons in quick reply
        };
    }
}
//# sourceMappingURL=TicTacToe.js.map