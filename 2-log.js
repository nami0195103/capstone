var express = require('express');
var app = express();

mysql = require('mysql');
var connection = mysql.createConnection({
        host: 'localhost',
        user: 'me',
        password: 'mypassword',
        database: 'mydb'
})
connection.connect();

function insert_sensor(device, unit, type, value, seq, ip) {
        obj = {};
        obj.seq = seq;
        obj.device = device;
        obj.unit = unit;
        obj.type = type;
        obj.value = value;
        obj.ip = ip.replace(/^.*:/, '');

        var query = connection.query('insert into sensors set ?', obj, function(err, rows, cols) {
                if (err) throw err;
                console.log("INSERTED IN DB= %j", obj);
        });
}

app.get('/dump', function (req, res) {  //send saved data to dump page
        var cnt = req.query.count;
        var query = connection.query('select * from sensors order by time desc limit ?', Number(cnt), function(err, rows) {
                if (err) throw err;
                res.end(JSON.stringify(rows));
        });
});

app.get('/log', function (req, res) {   //logging
        r = req.query;
        insert_sensor(r.device, r.unit, r.type, r.value, r.seq, req.connection.remoteAddress);
        res.end('INSERTED: ' + JSON.stringify(req.query));
});

app.get('/', function (req, res) {
          res.end('check the temperature->   http://3.18.106.19:8000/dump?count=45');
});

app.listen(8000, function () {
        console.log('Example app listening on port 8000!');
});
