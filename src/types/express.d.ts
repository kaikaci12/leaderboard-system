import { Session } from "../lib/sessionStore";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}
