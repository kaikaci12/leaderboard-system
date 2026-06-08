export interface Session {
  userId: number;
}
const store = new Map<string, Session>();
export const createSession = (userId: number) => {
  const sessionId = Math.floor(Math.random() * 1000000000);
  store.set(sessionId.toString(), { userId });
  return sessionId;
};
export const getSession = (sessionId: string) => {
  return store.get(sessionId);
};
export const deleteSession = (sessionId: string) => {
  store.delete(sessionId);
};
