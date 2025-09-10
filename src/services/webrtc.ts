// src/services/webrtc.service.ts
export class WebRTCService {
  /**
   * Return ICE servers for WebRTC
   * For local dev, STUN alone is enough.
   */
  static getIceServers() {
    return [
      { urls: "stun:stun.l.google.com:19302" }, // Free public STUN server
    ];
  }

  /**
   * Create an SDP offer
   */
  static async createOffer(pc: RTCPeerConnection) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  }

  /**
   * Handle remote SDP answer
   */
  static async handleAnswer(pc: RTCPeerConnection, sdp: RTCSessionDescriptionInit) {
    if (!pc.currentRemoteDescription) {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    }
  }

  /**
   * Add ICE candidate
   */
  static async handleCandidate(pc: RTCPeerConnection, candidate: RTCIceCandidateInit) {
    if (candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }
}
