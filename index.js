var http = require('http');
var url = require('url');

function cmd_exec(cmd, args, cb_stdout, cb_end) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var me = this;

    me.exit = 0;  // Send a cb to set 1 when cmd exits
    child.stdout.on('data', cb_stdout);
    child.stdout.on('end', cb_end);
}

http.createServer(function (req, res) {

    var channels;
    var self = this;
    this.bin = 'noolitepc';
    this.query = url.parse(req.url, true).query;

    this.answer = {
        code: 200,
        body: []
    };

    this.sendResponse = function (answer, res) {
        console.log(typeof res === 'undefined', res === null);
        if (typeof res === 'undefined' || res === null) {
            return;
        }

        res.writeHead(answer.code);
        res.write(JSON.stringify(answer.body));
        res.end();
    };

    this.action = function (query, channels, index, answer, callback, res) {
        // end loop
        if (index >= channels.length) {
            return callback(answer, res);
        }

        var attr = ['--' + this.query.cmd, channels[index], this.query.level || this.query.l];
        cmd_exec(this.bin, attr, function (data) {
                setTimeout(function () {
                    console.log(data);
                    answer.body.push(data);
                    return self.action(query, channels, ++index, answer, callback, res);
                }, 200);
            }, function () {
                setTimeout(function () {
                    console.log('cmd end');
                    answer.body.push(attr);
                    return self.action(query, channels, ++index, answer, callback, res);
                }, 200);
            }
        );
    };

    if (typeof this.query.cmd !== 'undefined' && typeof this.query.ch !== 'undefined') {
        channels = this.query.ch.split(',');
        this.action(this.query, channels, 0, this.answer, this.sendResponse, res);
    } else {
        console.log('cmd end1', this.query);
        this.answer.code = 400;
        this.answer.body = "Error";
        this.sendResponse();
    }
}).listen(8090);

console.log("Listening on http://127.0.0.1:8090/");