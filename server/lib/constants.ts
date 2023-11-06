'use strict';

enum Constants {
    // services
    RESTMain = 'rest-main',
    Storage = 'storage',
    PollService = 'poll-service',
    AuthService = 'auth-service',
    PassportSetup = 'passport-setup',

    // session
    SessionRedirectOnAuthSuccess = 'auth_redirect_success',
    SessionRedirectOnAuthFailure = 'auth_redirect_failure',

    // web parameters (query or body)
    WebParamSessionRedirectOnAuthSuccess = SessionRedirectOnAuthSuccess,
    WebParamSessionRedirectOnAuthFailure = SessionRedirectOnAuthFailure
}

export default Constants;