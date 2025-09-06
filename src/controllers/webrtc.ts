// src/controllers/webrtc.controller.ts
import { Request, Response } from "express";
import { WebRTCService } from "../services/webrtc";

export const WebRTCController = {
  getIceServers: (req: Request, res: Response) => {
    res.json(WebRTCService.getIceServers());
  },
};
