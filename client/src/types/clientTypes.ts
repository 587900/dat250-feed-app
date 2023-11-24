import Poll from '../../../common/model/poll';
import User from '../../../common/model/user';

export type CreatePollData = {
    code: string;
    title: string;
    description: string;
    private: boolean;
    open: boolean;
    timed: boolean;
    whitelist?: string[]; // Optional, only for private polls
    allowedVoters?: string[]; // Optional, only for public polls
    timeoutUnix?: number; // Optional, only for timed polls
};


export type LoginUserData = Omit<User, 'lastLoggedInWith' | 'creationUnix' | 'claims' | 'lastLoggedInUnix'>;

