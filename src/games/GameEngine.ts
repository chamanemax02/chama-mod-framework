import type { WASocket, WAMessage } from '@whiskeysockets/baileys';
import type { GameState, GameLaunchCardOptions, GameRenderResult } from '../types/games.js';
import { GameCards } from './GameCards.js';
import { HighwayRushGame } from './games/HighwayRush.js';
import { TicTacToeGame } from './games/TicTacToe.js';
import { InteractiveBuilder } from '../interactions/InteractiveBuilder.js';

export class GameEngine {
  private readonly sessions: Map<string, GameState<any>> = new Map();

  constructor(private readonly sock: WASocket) {}

  /**
   * Send a rich Game Launch Card (OpenGraph / Native Flow game launch)
   */
  public async sendGameLaunchCard(jid: string, options: GameLaunchCardOptions): Promise<WAMessage | undefined> {
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
  public async sendRichHTMLCard(
    jid: string,
    title: string,
    bodyText: string,
    linkUrl?: string,
    footer?: string
  ): Promise<WAMessage | undefined> {
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
  public async startHighwayRush(chatJid: string, playerJid: string, playerName = 'Player'): Promise<WAMessage | undefined> {
    const state = HighwayRushGame.createInitialState();
    const session: GameState = {
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
  public async handleHighwayRushMove(
    chatJid: string,
    action: 'left' | 'right' | 'straight' | 'boost'
  ): Promise<WAMessage | undefined> {
    const sessionId = `hr_${chatJid}`;
    const session = this.sessions.get(sessionId);
    if (!session || session.gameType !== 'highway_rush') return undefined;

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
  public async startTicTacToe(
    chatJid: string,
    playerX: string,
    playerO = 'BOT'
  ): Promise<WAMessage | undefined> {
    const state = TicTacToeGame.createInitialState(playerX, playerO);
    const session: GameState = {
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
  public async handleTicTacToeMove(
    chatJid: string,
    playerJid: string,
    cellIndex: number
  ): Promise<WAMessage | undefined> {
    const sessionId = `ttt_${chatJid}`;
    const session = this.sessions.get(sessionId);
    if (!session || session.gameType !== 'tictactoe') return undefined;

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
  private async sendGameRender(chatJid: string, render: GameRenderResult): Promise<WAMessage | undefined> {
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

  public getSession(chatJid: string, gameType: string): GameState | undefined {
    return this.sessions.get(`${gameType}_${chatJid}`);
  }

  public clearSession(chatJid: string, gameType: string): void {
    this.sessions.delete(`${gameType}_${chatJid}`);
  }
}
