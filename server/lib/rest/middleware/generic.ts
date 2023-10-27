'use strict';

import Logger from './../../logger';
import { ErrorHandler, Route } from './t-middlewares';

function _404() : Route { return (_, res) => res.sendStatus(404); }

function error_handler(title: string) : ErrorHandler {
    let logger = Logger.getLogger(`/lib/rest/middleware/generic.ts, error_handler, ${title}`);
    return (err, req, res, _) => {
        if (!res.headersSent) {
            logger.error(`Error serving request: ${req.path}. Error next line: `);
            logger.error(err);
            res.sendStatus(500);
        } else {
            logger.error(`Error serving request: ${req.path}. Headers already sent. Error next line: `);
            logger.error(err);
        }
    }
}

export { _404, error_handler }