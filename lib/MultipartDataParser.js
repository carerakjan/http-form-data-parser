'use strict';

const HttpFormParser = require('./HttpFormParser');

class MultipartDataParser extends HttpFormParser {

    static headerParse(header) {
        var headerFields = {};
        var matchResult = header.match(/^.*filename="([^"]*)"$/);

        if (matchResult) {
            headerFields.filename = matchResult[1];
            return headerFields;
        }

        matchResult = header.match(/^Content-Type:\s*(.*)$/);
        if (matchResult) {
            headerFields.mimeType = matchResult[1];
            return headerFields;
        }

        matchResult = header.match(/^.*name="([^"]*)"$/);
        if (matchResult) headerFields.name = matchResult[1];
        return headerFields;
    }

    parse() {
        var contentType = this._contentType,
            body = Buffer.concat(this._rawData).toString(),
            m = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i),
            boundary = '\r\n--',
            s = '\r\n';

        if ( !m ) {
            this.emit('error', new Error('Bad content-type header, no multipart boundary'));
            return null;
        }

        boundary += m[1] || m[2];
        s += body;

        var parts = s.split(new RegExp(boundary)),
            partsByName = {};

        for (var i = 1; i < parts.length - 1; i++) {
            var subParts = parts[i].split('\r\n\r\n'),
                headers = subParts[0].split('\r\n'),
                temp = null;
            
            for (var j = 1; j < headers.length; j++) {
                var headerFields = MultipartDataParser.headerParse(headers[j]);
                if ( headerFields.name ) {
                   temp = {type:'field', name: headerFields.name};
                } else if ( headerFields.filename ){
                   temp = {type:'file', name: headerFields.filename};
                } else if (headerFields.mimeType) {
                    temp.mimeType = headerFields.mimeType;
                }
            }

            if(temp) {

                if(temp.type === 'field') {
                    !partsByName.fields && (partsByName.fields = []);
                    partsByName.fields.push({
                        name: temp.name,
                        value: subParts[1]
                    });
                }

                if(temp.type === 'file') {
                    !partsByName.files && (partsByName.files = []);
                    partsByName.files.push({
                        name: temp.name,
                        value: subParts[1],
                        size: subParts[1].length,
                        mimeType: temp.mimeType
                    });
                }
            }
        }

        return partsByName;
    }
}

module.exports = MultipartDataParser;