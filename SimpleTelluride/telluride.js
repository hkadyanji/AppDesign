var fs = require("fs");
var http = require("http");
var sqlite = require("sqlite3");

function listPerformers(req, res) {
    var db = new sqlite.Database("telluride.sqlite");
    var db2 = new sqlite.Database("telluride.sqlite");
    var x = 0;
    var resp_text = "<!DOCTYPE html>" +
        "<html>" +
        "<body><table border=\"1\" cellpadding=\"5px\" style=\"border-collapse: collapse;\"><tr><th>Performer</th><th>Stage</th><th>Time</th></tr>";

    var theTbl = 0; //Stores the count of number of elements in the table
    var count = 0;

    db.all("SELECT ID, PERFORMER, STAGE, TIME FROM PERFORMANCE",
        function(err, row) {
            theTbl = row.length;
        });


    db.each("SELECT ID, PERFORMER, STAGE, TIME FROM PERFORMANCE",

        function(err, row) {
            db.each("SELECT NAME FROM PERFORMERS WHERE ID = " +
                row.PERFORMER,
                function(err2, row2) {
                    resp_text += "<tr><td>" + row2.NAME + "</td>";
                });

            db.each("SELECT NAME FROM STAGES WHERE ID = " +
                row.PERFORMER,
                function(err2, row3) {
                    count++;
                    resp_text += "<td>" + row3.NAME + "</td><td> " + row.TIME + "</td></tr>";
                },

                function() {
                    if (count === theTbl) {
                        resp_text += "</table></body>" + "</html>";
                        res.writeHead(200);
                        res.end(resp_text);
                    }
                });

        });

}

function serveFile(filename, req, res) {

    try {
        var contents = fs.readFileSync(filename).toString();

    } catch (e) {
        console.log(
            "Error: Something bad happened trying to open " + filename);
        process.exit(1);
        /* Return a 404 page */
    }

    res.writeHead(200);
    res.end(contents);
}

function serverFn(req, res) {
    var filename = req.url.substring(1, req.url.length);
    if (filename == "") {
        filename = "./index.html";
    }

    if (filename == "list_performers") {
        listPerformers(req, res);

    } else {
        serveFile(filename, req, res);
    }
}

var server = http.createServer(serverFn);

server.listen(8080);
