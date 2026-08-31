import {
  InteractiveBuilder,
  NativeFlowBuilder,
  CarouselBuilder,
  RichResponseBuilder,
  detectCapabilities,
  HighwayRushGame,
  TicTacToeGame,
  RtpPacketizer,
  FFmpegBridge,
  sanitizeLogObject,
  isJidGroup,
  isJidUser,
  formatToUserJid,
  formatToGroupJid
} from '../src/index.js';

console.log('🧪 Starting CHAMA MOD Framework Test Suite...\n');

// 1. Test Capabilities
console.log('1️⃣ Testing detectCapabilities()...');
const caps = detectCapabilities();
if (!caps.features.interactiveMessages || !caps.features.nativeFlowButtons || !caps.features.callLinksVoice) {
  throw new Error('Capabilities test failed');
}
console.log('✅ detectCapabilities passed!\n');

// 2. Test NativeFlowBuilder
console.log('2️⃣ Testing NativeFlowBuilder...');
const nfb = new NativeFlowBuilder()
  .addQuickReply('Click Here', 'btn_click')
  .addUrl('Google', 'https://google.com')
  .addCall('Support', '+1234567890')
  .addCopyCode('Coupon', 'SAVE50')
  .addSingleSelect('Menu', [
    {
      title: 'Section 1',
      rows: [{ id: 'row_1', title: 'Option 1', description: 'Desc 1' }]
    }
  ]);
const buttons = nfb.build();
if (buttons.length !== 5) {
  throw new Error(`Expected 5 buttons, got ${buttons.length}`);
}
console.log('✅ NativeFlowBuilder passed!\n');

// 3. Test InteractiveBuilder
console.log('3️⃣ Testing InteractiveBuilder...');
const interactiveMsg = new InteractiveBuilder()
  .setHeader('CHAMA Header', 'Subtitle')
  .setBody('Interactive Body')
  .setFooter('Interactive Footer')
  .setButtons(buttons)
  .build();

if (!interactiveMsg.viewOnceMessage?.message?.interactiveMessage?.nativeFlowMessage?.buttons) {
  throw new Error('InteractiveBuilder structure test failed');
}
console.log('✅ InteractiveBuilder passed!\n');

// 4. Test CarouselBuilder
console.log('4️⃣ Testing CarouselBuilder...');
const carouselMsg = new CarouselBuilder()
  .setSummary('Carousel Title')
  .addCard('Card 1', 'Body 1', 'Footer 1', (b) => b.addQuickReply('Card 1 Btn', 'c1'))
  .addCard('Card 2', 'Body 2', 'Footer 2', (b) => b.addUrl('Card 2 URL', 'https://example.com'))
  .build();

const cards = carouselMsg.viewOnceMessage?.message?.interactiveMessage?.carouselMessage?.cards;
if (!cards || cards.length !== 2) {
  throw new Error('CarouselBuilder cards test failed');
}
console.log('✅ CarouselBuilder passed!\n');

// 5. Test RichResponseBuilder
console.log('5️⃣ Testing RichResponseBuilder...');
const richMsg = new RichResponseBuilder()
  .setTitle('Rich Title')
  .setBody('Rich Body Content')
  .setFooter('Rich Footer')
  .addQuickReply('Quick Button', 'qb1')
  .addUrl('Visit', 'https://google.com')
  .build();

if (!richMsg.viewOnceMessage?.message?.interactiveMessage?.body) {
  throw new Error('RichResponseBuilder test failed');
}
console.log('✅ RichResponseBuilder passed!\n');

// 6. Test Highway Rush Game Engine
console.log('6️⃣ Testing HighwayRushGame Engine...');
let hrState = HighwayRushGame.createInitialState();
if (hrState.score !== 0 || hrState.playerLane !== 1 || hrState.lives !== 3) {
  throw new Error('Initial HighwayRush state invalid');
}
hrState = HighwayRushGame.handleMove(hrState, 'left');
if (hrState.playerLane !== 0) {
  throw new Error('HighwayRush steer left failed');
}
const hrRender = HighwayRushGame.render(hrState);
if (!hrRender.displayBoard.includes('HIGHWAY RUSH')) {
  throw new Error('HighwayRush render failed');
}
console.log('✅ HighwayRushGame passed!\n');

// 7. Test TicTacToe Game Engine
console.log('7️⃣ Testing TicTacToeGame Engine...');
let tttState = TicTacToeGame.createInitialState('player1@s.whatsapp.net', 'BOT');
tttState = TicTacToeGame.handleMove(tttState, 'player1@s.whatsapp.net', 0);
if (tttState.board[0] !== 'X') {
  throw new Error('TicTacToe move failed');
}
const tttRender = TicTacToeGame.render(tttState);
if (!tttRender.displayBoard.includes('TIC-TAC-TOE')) {
  throw new Error('TicTacToe render failed');
}
console.log('✅ TicTacToeGame passed!\n');

// 8. Test RTP Packetizer (RFC 3550 & RFC 7741 VP8)
console.log('8️⃣ Testing RTP Packetizer & VP8 Descriptors...');
const packetizer = new RtpPacketizer(96, 90000);
const rawChunk = Buffer.from('TEST_VP8_PAYLOAD_DATA_FRAME');
const rtpPacket = packetizer.packetizeVP8(rawChunk, true, true, true);
if (rtpPacket.length !== 12 + 1 + rawChunk.length) {
  throw new Error(`RTP packet size invalid. Expected ${12 + 1 + rawChunk.length}, got ${rtpPacket.length}`);
}
// Verify RTP version 2 (first byte 0x80)
if (rtpPacket[0] !== 0x80) {
  throw new Error('RTP header Version != 2');
}
console.log('✅ RTP Packetizer passed!\n');

// 9. Test FFmpeg Availability
console.log('9️⃣ Testing FFmpeg availability...');
const ffmpegAvailable = await FFmpegBridge.isFFmpegAvailable();
console.log(`FFmpeg status on system: ${ffmpegAvailable ? '✅ Installed & Ready' : '⚠️ Missing'}`);

// 10. Test Security & Sanitization
console.log('🔟 Testing Security Sanitization...');
const sensitiveData = {
  user: 'test_user',
  privateKey: 'secret_hex_key_12345',
  nested: {
    advSecretKey: 'top_secret',
    token: 'jwt_token'
  }
};
const sanitized: any = sanitizeLogObject(sensitiveData);
if (sanitized.privateKey !== '[PROTECTED_CREDENTIAL]' || sanitized.nested.advSecretKey !== '[PROTECTED_CREDENTIAL]') {
  throw new Error('Sanitize sensitive keys failed');
}
console.log('✅ Security sanitization passed!\n');

// 11. Test JID Helpers
console.log('1️⃣1️⃣ Testing JID helpers...');
if (!isJidGroup('123456789-987654@g.us') || isJidGroup('94771234567@s.whatsapp.net')) {
  throw new Error('isJidGroup failed');
}
if (!isJidUser('94771234567@s.whatsapp.net')) {
  throw new Error('isJidUser failed');
}
if (formatToUserJid('94771234567') !== '94771234567@s.whatsapp.net') {
  throw new Error('formatToUserJid failed');
}
if (formatToGroupJid('12345-67890') !== '12345-67890@g.us') {
  throw new Error('formatToGroupJid failed');
}
console.log('✅ JID helpers passed!\n');

console.log('🎉 ALL UNIT & PROTOCOL TESTS PASSED WITH 100% SUCCESS!');
