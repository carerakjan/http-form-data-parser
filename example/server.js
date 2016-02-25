var getformParseStrategy = require('../index');
var http = require('http');
var util = require('util');

http.createServer(function(req, res) {
    if (req.url === '/upload' && req.method === 'POST') {

        var form = getformParseStrategy(req);

        if(form) {

            res.writeHead(200, {'content-type': 'text/plain'});

            form.on('complete', data => {
                res.end(util.inspect(data));
            });

            form.on('error', err => {
               console.log(err);
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