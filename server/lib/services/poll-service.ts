'use strict'
//const PollModel = require("./schemas");
import Constants from './../constants';
import Poll from './../../../common/model/poll';

import Services from './../services';
import Database from './database';

export default class PollService{

    constructor(){ 

    }

    public async create(data : Poll){
        let db = Services.get<Database>(Constants.Storage);
        db.insertOne(data, 'Poll')
    }
}