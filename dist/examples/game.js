import makeChamaSocket, { useMultiFileAuthState } from '../src/index.js';
import pino from 'pino';
async function main() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const sock = makeChamaSocket({
        auth: state,
        logger: pino({ level: 'silent' })
    });
    sock.raw.ev.on('creds.update', saveCreds);
    sock.onMessage(async (ctx) => {
        // Game launch card
        if (ctx.text === '!game') {
            await sock.sendGameLaunchCard(ctx.chatId, {
                gameName: 'Highway Rush 🏎️',
                title: 'Highway Rush: Extreme Drift',
                description: 'Race across a 3-lane highway! Dodge obstacles, use nitro boost, and beat high scores in real-time!',
                highScore: 1450,
                difficulty: 'medium',
                category: 'Arcade Racing'
            });
        }
        // Start Highway Rush interactive session
        if (ctx.text === '!play-rush' || ctx.text === 'start_game_highway_rush') {
            await sock.games.startHighwayRush(ctx.chatId, ctx.senderJid, 'Player');
        }
        // Steering controls
        if (ctx.text === 'game_move_left') {
            await sock.games.handleHighwayRushMove(ctx.chatId, 'left');
        }
        if (ctx.text === 'game_move_right') {
            await sock.games.handleHighwayRushMove(ctx.chatId, 'right');
        }
        if (ctx.text === 'game_move_boost') {
            await sock.games.handleHighwayRushMove(ctx.chatId, 'boost');
        }
        // Tic-Tac-Toe
        if (ctx.text === '!play-ttt' || ctx.text === 'start_game_tictactoe') {
            await sock.games.startTicTacToe(ctx.chatId, ctx.senderJid, 'BOT');
        }
        if (ctx.text && ctx.text.startsWith('ttt_move_')) {
            const idx = parseInt(ctx.text.replace('ttt_move_', ''), 10);
            await sock.games.handleTicTacToeMove(ctx.chatId, ctx.senderJid, idx);
        }
    });
}
main().catch(console.error);
//# sourceMappingURL=game.js.map