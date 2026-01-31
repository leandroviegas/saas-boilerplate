import socket from '@/utils/client/socket';
import { useEffect } from 'react';

export enum wsTypeEnum {
    NEW_NOTIFICATION = 'new-notification',
    SESSION_REVOKED = 'session-revoked'
}

export interface WsData {
    type: wsTypeEnum;
}

export function useWebsockets<T extends WsData>(
    wsEvent: string, 
    callback: (data: T) => void, 
    state: boolean
) {
    useEffect(() => {
        if (!state) {
            return; 
        }
        socket.on(wsEvent, callback);
        return () => {
            socket.off(wsEvent, callback);
        };
    }, [wsEvent, state]);
};