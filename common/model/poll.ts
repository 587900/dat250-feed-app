'use strict';

import { KeyToValue } from './../types';
import Vote, { VoteSelection } from './vote';

type AllowedVoteType = 'web-user' | 'iot-device';

type PrivatePoll = {
    private: true,
    whitelist: string[]
}

type PublicPoll = {
    private: false,
    allowedVoters: AllowedVoteType[]
}

type TimedPoll = {
    timed: true,
    timeoutUnix: number
}

type UntimedPoll = {
    timed: false
}

type Poll = {
    code: string,
    ownerId: string,
    creationUnix: number,
    open: boolean,
    title: string,
    description: string,
    cachedVotes: KeyToValue<VoteSelection, number>
} & (PrivatePoll | PublicPoll) & (TimedPoll | UntimedPoll)

export default Poll;
export { AllowedVoteType };