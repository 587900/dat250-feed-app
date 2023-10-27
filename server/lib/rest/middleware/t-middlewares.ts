'use strict';

import express from 'express'

type Route = (request : express.Request, response : express.Response) => any
type Middleware = (request : express.Request, response : express.Response, next : express.NextFunction) => any
type ErrorHandler = (error : any, request : express.Request, response : express.Response, next : express.NextFunction) => any

export { Route, Middleware, ErrorHandler }