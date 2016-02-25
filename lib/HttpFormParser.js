'use strict';

const Writable = require('stream').Writable;

class HttpFormParser extends Writable {
    constructor(request) {

        super();

        this._rawData = [];
        this._contentType = request.headers['content-type'];

        request.pipe(this);

        request.on('end', () => {
           this.end();
        });

        this.on('finish', () => {
           this.emit('form:parse', this.parse());
        });

        this.on('error', err => {
           console.log(err);
        });

    }

    _write(chunk, enc, next) {
        this._rawData.push(chunk);
        next();
    }
}

module.exports = HttpFormParser;