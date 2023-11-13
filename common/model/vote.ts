'use strict';

type VoteSelection = 'green' | 'red';

type Vote = {
    userId: string | null,
    pollCode: string,
    creationUnix: number,
    selection: VoteSelection
}

export { VoteSelection };
export default Vote;