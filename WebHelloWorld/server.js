var http = require( "http" );
var fs = require('fs');

function serverFn(req, res){

 var myUrl = req.url;
 var theFields = myUrl.substring(8);
 var values = theFields.split("&");

 var theInfo = [];
 var name = values[0].split("=")[1];
 theInfo.push(name);
 var pswd = values[1].split("=")[1];
 theInfo.push(pswd);
 var sex = values[2].split("=")[1];
 theInfo.push(sex);
 
 if(values.length == 4){
  var subs = values[3].split("=")[1];
  theInfo.push(subs);

}else if(values.length == 5){
  var subs = values[3].split("=")[1];
  var subs1 = values[4].split("=")[1];
  theInfo.push(subs);
  theInfo.push(subs1);
}

var myCont = "";

for(var i = 0; i < theInfo.length; i++){
  myCont = myCont + " " + theInfo[i];
}

myCont += "\r";

fs.stat('info.txt', function(err, stat) {
    if(err == null) {
        fs.appendFile('info.txt', myCont, function (err) {
           if (err) return console.log(err);
	});
    } else if(err.code == 'ENOENT') {
        fs.writeFile('info.txt', myCont, function (err) {
  	if (err) return console.log(err);
  	});
    } else {
        console.log('Some other error: ', err.code);
    }
});
  
  
  res.writeHead( 200 );
  
 var h = "<!DOCTYPE html>"+
        "<html>"+
        "<body>"+
        "<form action='myform' method='get'>"+
        "<label>Name</label><input name='textbox' type='text' value='your name'><br/>"+
        "<label>Password</label><input name='textbox' type='password' value='your name'><br/>"+
        "<input type='radio' name='sex' value='male' checked>Male<br/>" +
        "<input type='radio' name='sex' value='female'>Female<br/>" +
        "<input type='checkbox' name='subs' value='day'>1 day Subscription<br>" +
        "<input type='checkbox' name='subs' value='month'>30 days subscription<br>" +
        "<input type='submit' value='Submit Info'>"+
        "</form>"+
        "</body>"+
        "</html>";
    res.end( h );
}

var server = http.createServer( serverFn );

server.listen(8080);
