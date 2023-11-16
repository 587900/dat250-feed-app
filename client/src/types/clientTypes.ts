import Poll from '../../../common/model/poll';
import User from '../../../common/model/user';

export type CreatePollData = Omit<Poll, 'ownerId' | 'creationUnix' | 'open' | 'cachedVotes'>;

export type LoginUserData = Omit<User, 'lastLoggedInWith' | 'creationUnix' | 'claims' | 'lastLoggedInUnix'>;

