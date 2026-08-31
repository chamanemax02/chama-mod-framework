import type { HighwayRushState, GameRenderResult } from '../../types/games.js';
import { NativeFlowBuilder } from '../../interactions/NativeFlowBuilder.js';

export class HighwayRushGame {
  public static createInitialState(): HighwayRushState {
    return {
      score: 0,
      playerLane: 1, // 0 = Left, 1 = Center, 2 = Right
      distance: 0,
      obstacles: [
        { lane: 0, y: 3 },
        { lane: 2, y: 6 }
      ],
      gameOver: false,
      lives: 3,
      speed: 100
    };
  }

  public static handleMove(state: HighwayRushState, action: 'left' | 'right' | 'straight' | 'boost'): HighwayRushState {
    if (state.gameOver) return state;

    let newLane = state.playerLane;
    if (action === 'left' && newLane > 0) newLane -= 1;
    if (action === 'right' && newLane < 2) newLane += 1;

    const addedDistance = action === 'boost' ? 200 : 100;
    const addedScore = action === 'boost' ? 25 : 10;

    // Move obstacles down
    const nextObstacles = state.obstacles
      .map((obs) => ({ lane: obs.lane, y: obs.y - (action === 'boost' ? 2 : 1) }))
      .filter((obs) => obs.y > 0);

    // Spawn new obstacle
    if (Math.random() > 0.4) {
      const randomLane = Math.floor(Math.random() * 3);
      nextObstacles.push({ lane: randomLane, y: 8 });
    }

    // Check collision at player position (y = 1)
    const collision = nextObstacles.some((obs) => obs.lane === newLane && (obs.y === 1 || obs.y === 2));
    let newLives = state.lives;
    let isGameOver = false;

    if (collision) {
      newLives -= 1;
      if (newLives <= 0) {
        isGameOver = true;
      }
    }

    return {
      score: state.score + (collision ? 0 : addedScore),
      playerLane: newLane,
      distance: state.distance + addedDistance,
      obstacles: nextObstacles,
      gameOver: isGameOver,
      lives: newLives,
      speed: Math.min(220, state.speed + 5)
    };
  }

  public static render(state: HighwayRushState): GameRenderResult {
    const laneNames = ['LEFT', 'CENTER', 'RIGHT'];
    const roadHeight = 7;
    let board = `🏎️ *HIGHWAY RUSH - SPEEDWAY* 🏁\n`;
    board += `━━━━━━━━━━━━━━━━━━━━━\n`;
    board += `❤️ Lives: ${'❤️'.repeat(state.lives)}${'🖤'.repeat(Math.max(0, 3 - state.lives))} | 🏆 Score: *${state.score}*\n`;
    board += `🛣️ Distance: *${state.distance}m* | ⚡ Speed: *${state.speed} km/h*\n`;
    board += `━━━━━━━━━━━━━━━━━━━━━\n`;

    // Render road tracks
    for (let y = roadHeight; y >= 1; y--) {
      let row = `║ `;
      for (let l = 0; l < 3; l++) {
        const hasObstacle = state.obstacles.some((o) => o.lane === l && o.y === y);
        const isPlayer = state.playerLane === l && y === 1;

        if (isPlayer && hasObstacle) {
          row += `💥 `;
        } else if (isPlayer) {
          row += `🏎️ `;
        } else if (hasObstacle) {
          row += `🚧 `;
        } else {
          row += ` ⬝ `;
        }
        if (l < 2) row += `┆ `;
      }
      row += ` ║\n`;
      board += row;
    }
    board += `━━━━━━━━━━━━━━━━━━━━━\n`;

    if (state.gameOver) {
      board += `💥 *GAME OVER! CRASH OCCURRED!* 💥\n`;
      board += `Final Score: *${state.score}* | Distance: *${state.distance}m*\n`;
    } else {
      board += `Current Lane: *${laneNames[state.playerLane]}*\n`;
    }

    const buttons = new NativeFlowBuilder();
    if (!state.gameOver) {
      buttons.addQuickReply('⬅️ Steer Left', 'game_move_left');
      buttons.addQuickReply('⬆️ Nitro Boost', 'game_move_boost');
      buttons.addQuickReply('➡️ Steer Right', 'game_move_right');
    } else {
      buttons.addQuickReply('🔄 Play Again', 'start_game_highway_rush');
    }

    return {
      title: 'Highway Rush 🏎️',
      displayBoard: board,
      footer: 'CHAMA Gaming Engine • Tap button to steer',
      buttons: buttons.build()
    };
  }
}
