'use strict';

type Claim = 'web-user' | 'admin' | 'iot-device' | 'web-user-guest';
type LastLoggedInWith = 'google' | 'iot-device' | 'none' | 'local' | 'local-guest';

type User = {
    id: string,
    creationUnix: number,
    lastLoggedInWith: LastLoggedInWith,
    lastLoggedInUnix: number
    claims: Claim[],
    firstName: string,
    lastName: string,
    username : string,
    guest : boolean
}

export default User;
export type { LastLoggedInWith, Claim }