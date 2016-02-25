'use strict';

const MultipartDataParser = require('./lib/MultipartDataParser');
const UrlencodedDataParser = require('./lib/UrlencodedDataParser');

module.exports = function(request){

    var contentType = String(request.headers['content-type']);

    if(~contentType.indexOf('application/x-www-form-urlencoded')) {
        return new UrlencodedDataParser(request);
    }

    if(~contentType.indexOf('multipart/form-data')) {
        return new MultipartDataParser(request);
    }

    if(~contentType.indexOf('text/plain')) {

    }

    return null;

};