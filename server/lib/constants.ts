'use strict';

enum Constants {
    // services
    RESTMain = 'rest-main',
    Storage = 'storage',
    PollService = 'poll-service',
    UserService = 'user-service',
    VoteService = 'vote-service',
    AuthService = 'auth-service',
    DweetSender = 'dweet-sender',
    MQTTSender = 'mqtt-sender',
    EventMaster = 'event-master',
    PassportSetup = 'passport-setup',

    // session
    SessionRedirectOnAuthSuccess = 'auth_redirect_success',
    SessionRedirectOnAuthFailure = 'auth_redirect_failure',

    // web parameters (query or body)
    WebParamSessionRedirectOnAuthSuccess = SessionRedirectOnAuthSuccess,
    WebParamSessionRedirectOnAuthFailure = SessionRedirectOnAuthFailure,

    // database collection names
    DBPolls = 'polls',
    DBVotes = 'votes',
    DBUsers = 'users',
    DBAUthLinks = 'auth-links',
}

export default Constants;