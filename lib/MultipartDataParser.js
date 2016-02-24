'use strict';

const HttpFormParser = require('./HttpFormParser');

class MultipartDataParser extends HttpFormParser {

    static headerParse(header) {
        var headerFields = {};
        var matchResult = header.match(/^.*name="([^"]*)"$/);
        if (matchResult) headerFields.name = matchResult[1];
        return headerFields;
    }

    static rawStringToBuffer(str) {
        var idx, len = str.length, arr = new Array(len);
        for (idx = 0; idx < len; ++idx) {
            arr[idx] = str.charCodeAt(idx) & 0xFF;
        }
        return new Uint8Array(arr).buffer;
    }

    parse() {
        var body = this._body,
            contentType = this._contentType,
            m = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i),
            boundary = '\r\n--',
            s = '\r\n';

        if ( !m ) {
            this.emit('parse:error', new Error('Bad content-type header, no multipart boundary'));
            return;
        }

        boundary += m[1] || m[2];

        var isRaw = typeof body !== 'string';

        s += isRaw
            ? String.fromCharCode.apply(null, new Uint8Array(body))
            : body;

        var parts = s.split(new RegExp(boundary)),
            partsByName = {};

        for (var i = 1; i < parts.length - 1; i++) {
            var subParts = parts[i].split('\r\n\r\n'),
                headers = subParts[0].split('\r\n'),
                fieldName = null;
            
            for (var j = 1; j < headers.length; j++) {
                var headerFields = MultipartDataParser.headerParse(headers[j]);
                if ( headerFields.name ) {
                    fieldName = headerFields.name;
                }
            }

            if(fieldName) {
                partsByName[fieldName] = isRaw
                    ? MultipartDataParser.rawStringToBuffer(subParts[1])
                    : subParts[1];    
            }
            
        }

        return partsByName;
    }
}

module.exports = MultipartDataParser;