import Poll from '../../../common/model/poll';

export type CreatePollData = Omit<Poll, 'ownerId' | 'creationUnix' | 'open' | 'cachedVotes'>;

