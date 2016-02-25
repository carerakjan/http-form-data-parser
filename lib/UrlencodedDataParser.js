'use strict';

const HttpFormParser = require('./HttpFormParser');
const querystring = require('querystring');

class UrlencodedDataParser extends HttpFormParser {

    parse() {
        var body = Buffer.concat(this._rawData).toString(),
            parsed = querystring.parse(body);

        return Object.keys(parsed).reduce((memo, next) => {
            memo.fields.push({ name: next, value: parsed[next] });
            return memo;
        }, { fields: [] });
    }
}

module.exports = UrlencodedDataParser;