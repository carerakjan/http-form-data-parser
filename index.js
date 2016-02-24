'use strict';

const MultipartDataParser = require('./lib/MultipartDataParser');

module.exports = function(request){

    var contentType = String(request.headers['content-type']);

    if(~contentType.indexOf('application/x-www-form-urlencoded')) {

    }

    if(~contentType.indexOf('multipart/form-data')) {
        return new MultipartDataParser(request);
    }

    if(~contentType.indexOf('text/plain')) {

    }

    return null;

};