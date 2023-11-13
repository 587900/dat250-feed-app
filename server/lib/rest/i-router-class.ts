'use strict';

import { Router } from 'express';
import FeedUser from './../../../common/model/user';
import { KeyValuePair } from './../../../common/types';

declare global {
    namespace Express {
        interface User extends FeedUser {}
        interface Request {
            bodyQuery: KeyValuePair<string>;
        }
    }
}

export default interface IRouterClass {
    create() : Router
}