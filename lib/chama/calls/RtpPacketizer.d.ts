/**
 * RFC 3550 & RFC 7741 RTP Packetizer for WhatsApp VoIP Video / Audio Streaming
 */
export declare class RtpPacketizer {
    private sequenceNumber;
    private timestamp;
    private readonly ssrc;
    private readonly payloadType;
    private readonly clockRate;
    constructor(payloadType?: number, clockRate?: number, ssrc?: number);
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
    packetize(payload: Buffer | Uint8Array, marker?: boolean, timeIncrement?: number): Buffer;
    /**
     * Packetize VP8 Video Frame with RFC 7741 VP8 Payload Descriptor
     */
    packetizeVP8(frameChunk: Buffer, isKeyFrame?: boolean, isFirstChunk?: boolean, isLastChunk?: boolean): Buffer;
    getSSRC(): number;
}
//# sourceMappingURL=RtpPacketizer.d.ts.map