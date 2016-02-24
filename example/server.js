var getformParseStrategy = require('../index');
var http = require('http');
var util = require('util');

http.createServer(function(req, res) {
    if (req.url === '/upload' && req.method === 'POST') {

        var parser = getformParseStrategy(req);

        if(parser) {

            res.writeHead(200, {'content-type': 'text/plain'});

            parser.on('form:progress', loadedSize => {
                res.write((loadedSize/1024).toFixed(2) + 'Kb\n');
            });

            parser.on('form:error', err => {
               console.log(err);
            });

            parser.on('form:parse', data => {
                res.end(util.inspect(data));
            });
        }

        return;
    }

    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"><br>'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>'
    );
}).listen(8080);