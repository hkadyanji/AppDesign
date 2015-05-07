var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );

function servFunction(req, res, state)
{
    var filename = req.url.substring( 1, req.url.length );

    if( filename == "" )
    {
        filename = "./index.html";
    }
    if(filename == "updateContent")
    { 
       synContent(res, req);
    }
    else if ( filename.substring(0, 12) == "contentAdded")
    {
        updateContent( req, res , true);
    }
    else if( filename.substring(0, 14) == "contentRemoved")
    {
        updateContent( req, res , false);
    }
    else if( filename == "linkdb_front.js" )
    {
        serveFile( "linkdb_front.js", req, res );
    }
    else
    {
        serveFile( filename, req, res );
    }
}

function serveFile( filename, req, res )
{
    try
    {
    	var html = fs.readFileSync( filename ).toString();
    }
    catch( e )
    {
    	console.log( "Error: Something bad happened trying to open " + filename );
        res.writeHead( 404 );
        res.end( "" );
        return;
    }

    res.writeHead( 200 );
    res.end( html );
}

function updateContent( req, res, state )
{
 var db = new sqlite.Database( "linkdb.sqlite" );

 if(!req.url.split( "?" )[ 1 ]){

   return;
 }

 var fresh_content = req.url.split( "?" )[ 1 ];
 var link_inputs = fresh_content.split( "&" );
 var link = link_inputs[0].split( "=" )[1];
 var nickname = link_inputs[1].split( "=" )[1];
 nickname = decodeURIComponent( ( nickname + '' ).replace( /\+/g, '%20' ) );
 
if(link.substring(link.length-1, link.length) === "/"){
 link = link.substring(0, link.length-1);
}

 if(state)
 {
   var sql_cmd = "INSERT INTO LINKS ('ADDRESS', 'NICKNAME') VALUES ('"+ link+"', '" + nickname + "')";
 }
 else
 { 
   var sql_cmd = "DELETE FROM LINKS  WHERE ADDRESS='" + link + "' AND NICKNAME='" + nickname + "'";
 }
 
 db.run( sql_cmd );
 db.close();
 res.writeHead( 200 );
 res.end( "" );
 synContent(res, req);
}

function synContent(res, req){

  var linkStream = "";
  var db = new sqlite.Database( "linkdb.sqlite" );

  db.each( "SELECT * FROM LINKS", function( err, row ) {
   linkStream += row.ADDRESS + "&" + row.NICKNAME + "%";
   });
  db.close(function(){
     res.writeHead( 200 );
     res.end(JSON.stringify(linkStream));
  });
}

var server = http.createServer( servFunction );

server.listen( 8000 );
