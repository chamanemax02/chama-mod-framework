import { GameCards } from './GameCards.js';
import { HighwayRushGame } from './games/HighwayRush.js';
import { TicTacToeGame } from './games/TicTacToe.js';
import { InteractiveBuilder } from '../interactions/InteractiveBuilder.js';
export class GameEngine {
    sock;
    sessions = new Map();
    constructor(sock) {
        this.sock = sock;
    }
    /**
     * Send a rich Game Launch Card (OpenGraph / Native Flow game launch)
     */
    async sendGameLaunchCard(jid, options) {
        const protoMsg = GameCards.buildGameLaunchCard(options);
        const tag = this.sock.generateMessageTag();
        await this.sock.relayMessage(jid, protoMsg, {
            messageId: tag
        });
        return {
            key: { remoteJid: jid, fromMe: true, id: tag },
            message: protoMsg,
            messageTimestamp: Math.floor(Date.now() / 1000)
        };
    }
    /**
     * Send a Rich HTML Styled Information Card
     */
    async sendRichHTMLCard(jid, title, bodyText, linkUrl, footer) {
        const protoMsg = GameCards.buildRichHTMLCard(title, bodyText, linkUrl, footer);
        const tag = this.sock.generateMessageTag();
        await this.sock.relayMessage(jid, protoMsg, {
            messageId: tag
        });
        return {
            key: { remoteJid: jid, fromMe: true, id: tag },
            message: protoMsg,
            messageTimestamp: Math.floor(Date.now() / 1000)
        };
    }
    /**
     * Start a new Highway Rush interactive game session
     */
    async startHighwayRush(chatJid, playerJid, playerName = 'Player') {
        const state = HighwayRushGame.createInitialState();
        const session = {
            id: `hr_${chatJid}`,
            gameType: 'highway_rush',
            chatJid,
            players: [{ jid: playerJid, name: playerName, score: 0 }],
            currentTurn: playerJid,
            status: 'active',
            data: state,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        this.sessions.set(session.id, session);
        const render = HighwayRushGame.render(state);
        return await this.sendGameRender(chatJid, render);
    }
    /**
     * Handle Highway Rush move
     */
    async handleHighwayRushMove(chatJid, action) {
        const sessionId = `hr_${chatJid}`;
        const session = this.sessions.get(sessionId);
        if (!session || session.gameType !== 'highway_rush')
            return undefined;
        const nextState = HighwayRushGame.handleMove(session.data, action);
        session.data = nextState;
        session.updatedAt = Date.now();
        if (nextState.gameOver) {
            session.status = 'completed';
        }
        const render = HighwayRushGame.render(nextState);
        return await this.sendGameRender(chatJid, render);
    }
    /**
     * Start a new Tic-Tac-Toe interactive game session
     */
    async startTicTacToe(chatJid, playerX, playerO = 'BOT') {
        const state = TicTacToeGame.createInitialState(playerX, playerO);
        const session = {
            id: `ttt_${chatJid}`,
            gameType: 'tictactoe',
            chatJid,
            players: [
                { jid: playerX, name: 'Player X', score: 0 },
                { jid: playerO, name: playerO === 'BOT' ? 'Bot' : 'Player O', score: 0 }
            ],
            currentTurn: playerX,
            status: 'active',
            data: state,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        this.sessions.set(session.id, session);
        const render = TicTacToeGame.render(state);
        return await this.sendGameRender(chatJid, render);
    }
    /**
     * Handle Tic-Tac-Toe move
     */
    async handleTicTacToeMove(chatJid, playerJid, cellIndex) {
        const sessionId = `ttt_${chatJid}`;
        const session = this.sessions.get(sessionId);
        if (!session || session.gameType !== 'tictactoe')
            return undefined;
        const nextState = TicTacToeGame.handleMove(session.data, playerJid, cellIndex);
        session.data = nextState;
        session.updatedAt = Date.now();
        if (nextState.winner) {
            session.status = 'completed';
        }
        const render = TicTacToeGame.render(nextState);
        return await this.sendGameRender(chatJid, render);
    }
    /**
     * Render and relay game output to WhatsApp chat
     */
    async sendGameRender(chatJid, render) {
        const protoMsg = InteractiveBuilder.fromOptions({
            header: { title: render.title },
            body: render.displayBoard,
            footer: render.footer,
            buttons: render.buttons
        });
        const tag = this.sock.generateMessageTag();
        await this.sock.relayMessage(chatJid, protoMsg, {
            messageId: tag
        });
        return {
            key: { remoteJid: chatJid, fromMe: true, id: tag },
            message: protoMsg,
            messageTimestamp: Math.floor(Date.now() / 1000)
        };
    }
    getSession(chatJid, gameType) {
        return this.sessions.get(`${gameType}_${chatJid}`);
    }
    clearSession(chatJid, gameType) {
        this.sessions.delete(`${gameType}_${chatJid}`);
    }
}
//# sourceMappingURL=GameEngine.js.map