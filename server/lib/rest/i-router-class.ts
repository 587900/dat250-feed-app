'use strict';

import { Router } from "express";

export default interface IRouterClass {
    create() : Router
}