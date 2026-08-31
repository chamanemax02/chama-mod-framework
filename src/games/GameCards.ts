import { proto } from '@whiskeysockets/baileys';
import type { GameLaunchCardOptions } from '../types/games.js';
import { InteractiveBuilder } from '../interactions/InteractiveBuilder.js';
import { NativeFlowBuilder } from '../interactions/NativeFlowBuilder.js';

export class GameCards {
  /**
   * Builds a WhatsApp Native Flow Game Launch Card
   */
  public static buildGameLaunchCard(options: GameLaunchCardOptions): proto.IMessage {
    const builder = new NativeFlowBuilder();

    // Play Button (opens Web/Canvas Game URL or triggers game session)
    if (options.playUrl) {
      builder.addUrl(options.playButtonText || '🎮 Play Now', options.playUrl);
    } else {
      builder.addQuickReply(options.playButtonText || '🎮 Start Game', `start_game_${options.gameName.toLowerCase().replace(/\s+/g, '_')}`);
    }

    if (options.howToPlayUrl) {
      builder.addUrl(options.howToPlayButtonText || '📖 How to Play', options.howToPlayUrl);
    } else {
      builder.addQuickReply('📖 Rules', `rules_${options.gameName.toLowerCase().replace(/\s+/g, '_')}`);
    }

    const highScoreText = options.highScore ? `\n🏆 High Score: *${options.highScore}*` : '';
    const diffText = options.difficulty ? ` | ⚡ Difficulty: *${options.difficulty.toUpperCase()}*` : '';
    const catText = options.category ? ` | 🕹️ Genre: *${options.category}*` : '';

    const body = `*${options.title || options.gameName}*\n\n${options.description}${highScoreText}${diffText}${catText}\n\n_Tap button below to launch session_`;

    return InteractiveBuilder.fromOptions({
      header: {
        title: `CHAMA ARCADE: ${options.gameName}`,
        subtitle: options.category || 'Arcade Game'
      },
      body,
      footer: 'CHAMA MOD Gaming Engine 🚀',
      buttons: builder.build()
    });
  }

  /**
   * Build a rich HTML-styled card preview
   */
  public static buildRichHTMLCard(title: string, bodyText: string, linkUrl?: string, footer?: string): proto.IMessage {
    const builder = new NativeFlowBuilder();
    if (linkUrl) {
      builder.addUrl('🔗 Open Web Page', linkUrl);
    }
    builder.addQuickReply('✨ Refresh Info', 'refresh_info');

    return InteractiveBuilder.fromOptions({
      header: {
        title: `🌐 ${title}`
      },
      body: bodyText,
      footer: footer || 'CHAMA Web Engine',
      buttons: builder.build()
    });
  }
}
