# 🚀 CHAMA MOD Framework (Baileys v7 Modified & VoIP Streaming Layer)

Developer-focused, high-performance, fully-typed WhatsApp Web framework built on top of **`@whiskeysockets/baileys@7.0.0-rc14`**.

CHAMA MOD Framework provides an architectural mod wrapper (`makeChamaSocket`) over Baileys v7 with **Real-Time VoIP Video Call Streaming, Interactive Messages, Native Flow UI, Carousels, Call Links, WhatsApp Video Notes (PTV), Group & Newsletter Management, Interactive Game Engines, and Extensible Plugin Architecture**.

---

## 📑 Table of Contents (පටුන)

- [✨ Key Features (ප්‍රධාන විශේෂාංග)](#-key-features)
- [🔍 WhatsApp Protocol Compatibility Breakdown](#-whatsapp-protocol-compatibility-breakdown)
- [📦 Installation (ස්ථාපනය)](#-installation)
- [🚀 Quick Start (මූලික භාවිතය)](#-quick-start)
- [📹 Real-Time VoIP Video Call Streaming Engine](#-real-time-voip-video-call-streaming-engine)
- [🎥 WhatsApp Video Notes (PTV - Round Live Bubble)](#-whatsapp-video-notes-ptv---round-live-bubble)
- [📞 Voice & Video Calls / Call Links](#-voice--video-calls--call-links)
- [🌟 Rich Response & Interactive Builder](#-rich-response--interactive-builder)
- [🎠 Carousel Cards & Menus](#-carousel-cards--menus)
- [🎮 Gaming Engine & Rich Cards](#-gaming-engine--rich-cards)
- [👥 Group & Channel / Newsletter Operations](#-group--channel--newsletter-operations)
- [🔌 Extensible Plugin System](#-extensible-plugin-system)
- [🛡️ Security & Privacy Best Practices](#️-security--privacy-best-practices)
- [📂 Project Architecture (ව්‍යාපෘති ව්‍යුහය)](#-project-architecture)
- [🧪 Running Examples & Tests](#-running-examples--tests)

---

## ✨ Key Features

- **Built on `@whiskeysockets/baileys@7.0.0-rc14`**: Full native Baileys socket compatibility augmented with modular layers.
- **🎥 Real-Time VoIP Video Call Streaming**: Stream any MP4/MKV video file directly into an active WhatsApp Video Call when answered.
- **📹 WhatsApp Video Notes (PTV)**: Send instant round camera video bubbles (`ptv: true`) that auto-loop natively in chats.
- **Native Flow & Interactive UI**: `quick_reply`, `cta_url`, `cta_call`, `cta_copy`, `single_select` (lists/menus), and multi-card `carouselMessage`.
- **Rich Response Builder**: Fluent API for headers, body, footers, buttons, and menus without writing raw protobufs.
- **WhatsApp Call Suite**: Native Voice & Video call links (`createVoiceCallLink`, `createVideoCallLink`), incoming call detector, auto-reject, and signaling stanzas.
- **Interactive Game Engine**: Turn-based, real-time reactive games (Highway Rush 🏎️, Tic-Tac-Toe 🕹️, Trivia) and Native Flow Game Launch Cards.
- **Group & Newsletter / Channel Suite**: Full lifecycle management for Groups and WhatsApp Newsletters.
- **100% Strict TypeScript**: Zero unnecessary `any`, full type definitions and autocomplete.
- **Plugin Architecture**: Modular, lifecycle-aware plugin management (`sock.use(...)`).

---

## 🔍 WhatsApp Protocol Compatibility Breakdown

| Feature | WhatsApp Protocol Status | CHAMA Framework Implementation |
| :--- | :--- | :--- |
| **VoIP Video Call Streaming** | ✅ Supported with Media Bridge | `sock.streamVideoCall()` + `FFmpegBridge` + `RtpPacketizer` |
| **Video Notes (PTV Round Bubble)**| ✅ Supported | `sock.sendVideo(jid, buffer, { ptv: true })` |
| **Interactive Messages** | ✅ Supported | `sock.sendInteractive(...)` & `InteractiveBuilder` |
| **Native Flow Buttons** | ✅ Supported | Quick Reply, CTA URL, CTA Call, CTA Copy, Single Select |
| **Multi-Card Carousel** | ✅ Supported | `sock.sendCarousel(...)` & `CarouselBuilder` |
| **Call Links (Voice & Video)** | ✅ Supported | `createVoiceCallLink()` & `createVideoCallLink()` |
| **Call Rejection** | ✅ Supported | `rejectCall()` / Auto-reject |
| **Incoming Call Detection** | ✅ Supported | `sock.onCall(handler)` |
| **Interactive Game Engine** | ✅ Supported | State-driven Game Engine & Canvas/ASCII frames |
| **Message Edit / Delete / Pin** | ✅ Supported | `editMessage()`, `deleteMessage()`, `pinMessage()` |
| **WhatsApp Event Messages** | ✅ Supported | `sock.sendEvent(...)` |
| **Album Messages** | ✅ Supported | `sock.sendAlbum(...)` |
| **Newsletter / Channels** | ✅ Supported | Full management suite via `sock.newsletters` |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/chamanemax02/chama-mod-framework.git
cd chama-mod-framework

# Install dependencies
npm install

# Build TypeScript
npm run build
```

---

## 🚀 Quick Start

```typescript
import makeChamaSocket, {
  useMultiFileAuthState,
  DisconnectReason
} from './src/index.js';
import pino from 'pino';

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState('./session');

  const sock = makeChamaSocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true
  });

  sock.raw.ev.on('creds.update', saveCreds);

  sock.onConnectionUpdate((update) => {
    if (update.connection === 'open') {
      console.log('🎉 Connected to WhatsApp via CHAMA MOD Framework!');
      console.log('Capabilities:', sock.features());
    }
  });

  sock.onMessage(async (ctx) => {
    if (ctx.text === '!ping') {
      await ctx.reply('🏓 Pong from CHAMA MOD!');
    }
  });
}

start();
```

---

## 📹 Real-Time VoIP Video Call Streaming Engine

Initiate a genuine WhatsApp Video Call and stream any pre-recorded video file (MP4/MKV) in real-time when the recipient answers:

```typescript
import path from 'path';

// Call user and stream video file in real-time
const session = await sock.streamVideoCall('94771234567@s.whatsapp.net', {
  videoPath: path.resolve('./assets/my-video.mp4'),
  loop: true,       // Loop video during call
  fps: 30,          // 30 Frames Per Second
  width: 640,
  height: 480,
  bitrate: '500k',
  onConnected: () => {
    console.log('🎉 Callee answered! Live video stream is playing.');
  },
  onProgress: (seconds) => {
    console.log(`⏱️ Video Call active: ${seconds}s elapsed`);
  },
  onTerminated: (reason) => {
    console.log(`📴 Call ended: ${reason}`);
  }
});
```

---

## 🎥 WhatsApp Video Notes (PTV - Round Live Bubble)

Send an instant round camera video note (Push-to-Video) that auto-loops natively in WhatsApp chats:

```typescript
import fs from 'fs';

// Send as WhatsApp round live camera video note
await sock.raw.sendMessage(chatId, {
  video: fs.readFileSync('./my-video.mp4'),
  ptv: true, // 👈 Push-To-Video (Round Camera Video Note)
  mimetype: 'video/mp4'
});
```

---

## 📞 Voice & Video Calls / Call Links

### 1. Generate Call Links (Voice & Video)
```typescript
// Voice Call Link
const voiceLink = await sock.createVoiceCallLink();
console.log('Voice Call URL:', voiceLink.url);

// Video Call Link
const videoLink = await sock.createVideoCallLink();
console.log('Video Call URL:', videoLink.url);
```

### 2. Incoming Call Detection & Auto-Reject
```typescript
sock.onCall(async (ctx) => {
  console.log(`Call from: ${ctx.callerJid}, Type: ${ctx.isVideo ? 'Video' : 'Voice'}`);
  
  if (ctx.isIncoming) {
    await ctx.reject();
    await sock.sendText(ctx.callerJid, '📵 Calls are not accepted on this number.');
  }
});

// Or enable global auto-reject in one line:
sock.calls.setAutoReject(true, 'This automated number does not accept phone calls.');
```

---

## 🌟 Rich Response & Interactive Builder

```typescript
await sock.sendRichResponse(jid, {
  title: 'Highway Rush 🏎️',
  subtitle: 'CHAMA Arcade Speedway',
  body: 'Race across a 3-lane highway! Dodge obstacles and use nitro boost.',
  footer: 'CHAMA Gaming Suite',
  buttons: [
    {
      name: 'quick_reply',
      buttonParamsJson: { display_text: '🎮 Start Race', id: 'start_game_highway_rush' }
    },
    {
      name: 'cta_url',
      buttonParamsJson: { display_text: '🌐 Leaderboard', url: 'https://chama.dev/scores' }
    },
    {
      name: 'cta_copy',
      buttonParamsJson: { display_text: '🎟️ Copy Code', copy_code: 'SPEED2026' }
    }
  ]
});
```

---

## 🎠 Carousel Cards & Menus

```typescript
await sock.sendCarousel(jid, 'Browse our catalog:', [
  {
    header: '💎 Starter Tier',
    body: 'Automated auto-reply bot with custom trigger keywords.',
    buttons: [
      { name: 'quick_reply', buttonParamsJson: { display_text: 'Select Starter', id: 'plan_starter' } }
    ]
  },
  {
    header: '🚀 Pro Tier',
    body: 'Interactive buttons, Voice Call Links, and Games.',
    buttons: [
      { name: 'quick_reply', buttonParamsJson: { display_text: 'Select Pro', id: 'plan_pro' } }
    ]
  }
]);
```

---

## 🎮 Gaming Engine & Rich Cards

### Highway Rush 🏎️
```typescript
// Start game session
await sock.games.startHighwayRush(chatJid, playerJid);

// Handle moves ('left' | 'right' | 'boost')
await sock.games.handleHighwayRushMove(chatJid, 'left');
```

### Tic-Tac-Toe 🕹️
```typescript
// Start Tic-Tac-Toe vs AI Bot
await sock.games.startTicTacToe(chatJid, playerJid, 'BOT');

// Handle move on cell (0 to 8)
await sock.games.handleTicTacToeMove(chatJid, playerJid, 4);
```

---

## 👥 Group & Channel / Newsletter Operations

```typescript
// Groups
const meta = await sock.groups.getMetadata(groupJid);
await sock.groups.addParticipants(groupJid, ['94771234567@s.whatsapp.net']);
await sock.groups.setMemberAddMode(groupJid, 'admin_add');

// Event Messages
await sock.sendEvent(groupJid, {
  name: 'Community Meetup',
  description: 'Discussing new framework updates',
  startTime: new Date(Date.now() + 86400000)
});

// Newsletters / Channels
const channel = await sock.newsletters.create('CHAMA Announcements', 'Official Channel');
await sock.newsletters.follow(channel.id);
```

---

## 🔌 Extensible Plugin System

```typescript
import { antiCallPlugin, autoReadPlugin, commandRouterPlugin, type ChamaPlugin } from './src/index.js';

// Built-in plugins
await sock.use(antiCallPlugin({ message: 'Calls disabled.' }));
await sock.use(autoReadPlugin());

// Command router plugin
await sock.use(commandRouterPlugin({
  prefix: '!',
  commands: {
    ping: async (ctx) => ctx.reply('Pong!'),
    help: async (ctx) => ctx.reply('Help menu...')
  }
}));
```

---

## 🛡️ Security & Privacy Best Practices

- **Zero Credential Leaks**: Sensitive auth keys (`noiseKey`, `signedIdentityKey`, `advSecretKey`) are automatically masked by the security layer.
- **Protocol Integrity**: Does not fabricate invalid signatures or tamper with WhatsApp encryption keys.
- **Safe Logging**: Use `safeLog()` to log diagnostics without exposing credentials.

---

## 📂 Project Architecture

```
CHAMA MOD Framework/
├── src/
│   ├── index.ts                      # Main entry point & unified exports
│   ├── core/
│   │   ├── ChamaSocket.ts            # Core wrapper around Baileys WASocket
│   │   ├── Capabilities.ts           # Runtime capability & feature detection
│   │   └── Errors.ts                 # ChamaError, UnsupportedFeatureError, etc.
│   ├── messages/
│   │   ├── MessageManager.ts         # High-level sender for all message types
│   │   ├── EditDeletePin.ts          # Edit, delete, pin, unpin, reaction handlers
│   │   └── AlbumEvent.ts             # Album and WhatsApp Event message handlers
│   ├── interactions/
│   │   ├── InteractiveBuilder.ts     # Native Flow interactive message builder
│   │   ├── NativeFlowBuilder.ts      # Native Flow button builder
│   │   ├── CarouselBuilder.ts        # Multi-card carousel builder
│   │   └── RichResponseBuilder.ts    # Rich response builder
│   ├── games/
│   │   ├── GameEngine.ts             # Stateful game session manager
│   │   ├── GameCards.ts              # Rich Game Launch Cards
│   │   └── games/
│   │       ├── HighwayRush.ts        # Highway Rush arcade engine
│   │       └── TicTacToe.ts          # Tic-Tac-Toe interactive engine
│   ├── calls/
│   │   ├── CallManager.ts            # Incoming call listener, reject, call links
│   │   ├── CallLinks.ts              # Voice & Video call link generators
│   │   ├── CallSignaling.ts          # Call offer & terminate signaling stanzas
│   │   ├── VoIPMediaStreamer.ts      # Real-time video call streaming engine
│   │   ├── FFmpegBridge.ts           # FFmpeg transcoding bridge
│   │   └── RtpPacketizer.ts          # RFC 3550 & RFC 7741 RTP packetizer
│   ├── groups/
│   │   └── GroupManager.ts           # Group administration
│   ├── newsletters/
│   │   └── NewsletterManager.ts      # Channel / Newsletter operations
│   ├── events/
│   │   └── EventDispatcher.ts        # Typed event listener manager
│   ├── plugins/
│   │   ├── PluginManager.ts          # Plugin registry (sock.use)
│   │   ├── BuiltinPlugins.ts         # Anti-call, Auto-read, Command router
│   │   └── types.ts                  # Plugin interfaces
│   ├── types/                        # Full TypeScript definitions
│   └── utils/                        # Security, JID, media helpers
├── examples/                         # Developer sample scripts
│   ├── basic.ts
│   ├── rich.ts
│   ├── interactive.ts
│   ├── game.ts
│   ├── calls.ts
│   ├── call-link.ts
│   ├── video-call-stream.ts
│   ├── groups-newsletters.ts
│   └── plugins.ts
├── tests/
│   └── test-suite.ts                 # Comprehensive automated test suite
└── tsconfig.json
```

---

## 🧪 Running Examples & Tests

```bash
# Run unit & protocol tests (100% Pass)
npm test

# Run video call stream example
npx tsx examples/video-call-stream.ts

# Run interactive UI & carousel demo
npx tsx examples/interactive.ts

# Run arcade games demo
npx tsx examples/game.ts
```

---

## 👨‍💻 Author & License

- **Developer**: CHAMA (`chamanemax02`)
- **Base Package**: `@whiskeysockets/baileys@7.0.0-rc14`
- **License**: MIT
