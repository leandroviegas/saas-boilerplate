
// Types of websockets messages
export enum wsTypeEnum {
    NEW_NOTIFICATION = 'new-notification',
    SESSION_REVOKED = 'session-revoked',
}

// Types of websockets events
export enum wsEventEnum {
    NOTIFICATION = 'notification',
    AUTH = 'auth'
}