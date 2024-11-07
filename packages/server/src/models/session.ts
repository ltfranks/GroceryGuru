// login session
export interface Session{
    sessionId: string;
    userId: string;
    token: string;
    expiresAt: Date;
}