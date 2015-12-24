var trello = require('node-trello'),
    _ = require('lodash'),
    util = require('./util'),
    pickInputs = {
        board_id: 'board_id'
    },
    pickOutputs = {
        '-': {
            keyName: 'data',
            fields: {
                id: 'id',
                name: 'name',
                idList: 'idList',
                url: 'url'
            }
        }
    };

module.exports = {
    authOptions: function (dexter) {
        if (!dexter.environment('trello_api_key') || !dexter.environment('trello_token')) {
            this.fail('A [trello_api_key] or [trello_token] environment variables are required for this module');
            return false;
        } else {
            return {
                api_key: dexter.environment('trello_api_key'),
                token: dexter.environment('trello_token')
            }
        }
    },
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var auth = this.authOptions(dexter),
            getReqFields = "name,idList,url";

        if (!auth) return;

        var t = new trello(auth.api_key, auth.token);
        var inputs = util.pickStringInputs(step, pickInputs);

        if (_.isEmpty(inputs.board_id)) {
            return this.fail('A [boardId] variable is required for this module');
        } else {
            var boardId = inputs.board_id;
        }

        t.get("1/boards/" + boardId + "/cards", { fields: getReqFields }  , function(err, data) {
            if (!err) 
                this.complete(util.pickResult({data: data}, pickOutputs));
            else 
                this.fail(err);
        }.bind(this));
    }
};
