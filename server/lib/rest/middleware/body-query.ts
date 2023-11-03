'use strict';

import { Middleware } from './t-middlewares';

/* merge req.body and req.query into req.bodyQuery object */
export default function bodyQuery() : Middleware {
    return (req, _, next) => {
        (<any>req).bodyQuery = Object.assign({}, req.body, req.query);
        next();
    }
}