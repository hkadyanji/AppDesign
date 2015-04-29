var http = require('http');
var  fs = require('fs');

//Read a text file containing the links to the dowloadable files

if( process.argv.length < 3 ) //Make sure the file has a txt parameter to be read
{
    console.log( "Error: A file name with links is required" );
    process.exit( 1 );
}

var fn = process.argv[2]; //open the text file with links

try
{
    var lines = fs.readFileSync( fn ).toString().split( "\n" ); //Open file and store contents in an array
}
catch( e ) //throw error if file fails to open
{
    console.log(
        "Error: Something bad happened trying to open " + fn);
    process.exit( 1 );
}


var download = function(url, dest, cb){

	var file =fs.createWriteStream(dest);

	var request = http.get(url, function(response){
		response.pipe(file);

		file.on('finish', function(){
			file.close(cb("Done Downloading")); //close() is async, call cb after close completes
		});
	}).on('error', function(err){
		fs.unlink(dest); //Delete the file async
		if(cb) cb(err.message);
	})
};

function callBack(msg){

	console.log(msg);
}


for(var i=0, x = lines.length -1; i < x; i++){

	var url = lines[i];
	var dest = lines[++i];

	var urlCheck =/(?:http)[s\:]/;
	var dirCheck = /(\/)/;

	var urlRight = url.search(urlCheck);
	var dirExist = dest.search(dirCheck);

  if(urlRight !== -1 && dirExist === -1){
		download(url, dest, callBack);
	}else{
        console.log("Error with the destination of file or protocol for " + url + ":" + dest);
	}

}

