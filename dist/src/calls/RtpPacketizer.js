/**
 * RFC 3550 & RFC 7741 RTP Packetizer for WhatsApp VoIP Video / Audio Streaming
 */
export class RtpPacketizer {
    sequenceNumber;
    timestamp;
    ssrc;
    payloadType;
    clockRate;
    constructor(payloadType = 96, clockRate = 90000, ssrc) {
        this.payloadType = payloadType;
        this.clockRate = clockRate;
        this.sequenceNumber = Math.floor(Math.random() * 65535);
        this.timestamp = Math.floor(Math.random() * 4294967295);
        this.ssrc = ssrc || Math.floor(Math.random() * 4294967295);
    }
    /**
     * Builds an RTP packet from a media payload buffer
     *
     * RTP Header Format (12 bytes):
     * 0                   1                   2                   3
     * 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     * |V=2|P|X|  CC   |M|     PT      |       sequence number         |
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     * |                           timestamp                           |
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     * |           synchronization source (SSRC) identifier            |
     * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
     */
    packetize(payload, marker = false, timeIncrement = 3000) {
        const header = Buffer.alloc(12);
        // V=2, P=0, X=0, CC=0 -> 0x80
        header.writeUInt8(0x80, 0);
        // Marker (bit 7) + Payload Type (bits 0-6)
        const ptWithMarker = (marker ? 0x80 : 0x00) | (this.payloadType & 0x7f);
        header.writeUInt8(ptWithMarker, 1);
        // Sequence Number (16 bits)
        header.writeUInt16BE(this.sequenceNumber & 0xffff, 2);
        this.sequenceNumber = (this.sequenceNumber + 1) & 0xffff;
        // Timestamp (32 bits)
        header.writeUInt32BE(this.timestamp & 0xffffffff, 4);
        this.timestamp = (this.timestamp + timeIncrement) & 0xffffffff;
        // SSRC (32 bits)
        header.writeUInt32BE(this.ssrc & 0xffffffff, 8);
        const payloadBuffer = Buffer.isBuffer(payload) ? payload : Buffer.from(payload);
        return Buffer.concat([header, payloadBuffer]);
    }
    /**
     * Packetize VP8 Video Frame with RFC 7741 VP8 Payload Descriptor
     */
    packetizeVP8(frameChunk, isKeyFrame = false, isFirstChunk = true, isLastChunk = true) {
        // Basic VP8 payload descriptor (1 byte minimum):
        // X=0, R=0, N=0, S=(isFirstChunk), R=0, PID=0
        const vp8Descriptor = Buffer.alloc(1);
        const sBit = isFirstChunk ? 0x10 : 0x00;
        vp8Descriptor.writeUInt8(sBit, 0);
        const fullPayload = Buffer.concat([vp8Descriptor, frameChunk]);
        return this.packetize(fullPayload, isLastChunk, 3000); // 90000 / 30fps = 3000 ticks per frame
    }
    getSSRC() {
        return this.ssrc;
    }
}
//# sourceMappingURL=RtpPacketizer.js.map