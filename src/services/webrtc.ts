// src/services/webrtc.service.ts
export class WebRTCService {
  static getIceServers() {
    return [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "turn:turn.yourdomain.com:3478", username: "demo", credential: "password" },
    ];
  }

  static createOffer(pc: RTCPeerConnection) {
    return pc.createOffer();
  }

  static async handleAnswer(pc: RTCPeerConnection, sdp: RTCSessionDescriptionInit) {
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
  }

  static async handleCandidate(pc: RTCPeerConnection, candidate: RTCIceCandidateInit) {
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  }
}
