'use strict';

const Writable = require('stream').Writable;

class HttpFormParser extends Writable {
    constructor(request) {

        super();

        this._body = '';
        this._contentType = request.headers['content-type'];

        request.on('data', chunk => {
            this.write(chunk);
        });

        request.on('end', () => {
            this.emit('form:progress', this._body.length);
            this.emit('finish');
        });

        request.on('close', () => {
           this.emit('form:error', new Error('Connection was closed.'));
        });

        this.on('finish', () => {
           this.emit('form:parse', this.parse());
        });

    }

    _write(chunk, enc, next) {
        this._body += chunk;
        this.emit('form:progress', this._body.length);
        next();
    }
}

module.exports = HttpFormParser;