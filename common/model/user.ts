'use strict';

type Claim = 'web-user' | 'admin' | 'iot-device';
type LastLoggedInWith = 'google' | 'iot-device' | 'none';

type User = {
    id: string,
    creationUnix: number,
    lastLoggedInWith: LastLoggedInWith,
    lastLoggedInUnix: number
    claims: Claim[],
    firstName: string,
    lastName: string,
}

export default User;
export type { LastLoggedInWith, Claim }