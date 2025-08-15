import { RequestHandler } from "express";

export interface ServerDateResponse {
  currentDate: string;
  year: number;
  timestamp: number;
}

export const getServerDate: RequestHandler = (_req, res) => {
  const now = new Date();
  
  const response: ServerDateResponse = {
    currentDate: now.toISOString(),
    year: now.getFullYear(),
    timestamp: now.getTime()
  };
  
  res.json(response);
};
