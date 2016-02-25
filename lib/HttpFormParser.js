'use strict';

const Writable = require('stream').Writable;

class HttpFormParser extends Writable {
    constructor(request) {

        super();

        this._rawData = [];
        this._endData = null;
        this._contentType = request.headers['content-type'];

        request.pipe(this);

        request.on('error', error => {
            this.emit('error', error);
        });

        request.connection.on('close', () => {
            this.emit('error', new Error('Unexpected termination of connection.'));
        });

        this.on('finish', () => {
            this._endData = this.parse();
            this.emit('complete', this._endData);
        });

    }

    _write(chunk, enc, next) {
        this._rawData.push(chunk);
        next();
    }
}

module.exports = HttpFormParser;