var fs = require( "fs" );
var http = require( "http" );
var sqlite = require( "sqlite3" );

function serverFn( req, res )
{
    var filename = req.url.substring( 1, req.url.length );

    if( filename == "" )
    {
        filename = "./index.html";
    }

    if( filename.substring( 0, 14 ) == "list_students" )
    {
        listStudents( req, res );
    }
    else if( filename.substring( 0, 13 ) == "list_classes" )
    {
        listClasses( req, res );
    }
    else if( filename.substring( 0, 14 ) == "list_teachers" )
    {
        listTeachers( req, res );
    }
    else if( filename.substring( 0, 17 ) == "list_enrollments" )
    {
        listEnrollments( req, res );
    }
    else if( filename.substring( 0, 17 ) == "list_assignments" )
    {
        listAssignments( req, res );
    }
    else if( filename.substring( 0, 11 ) == "add_student" )
    {
        addStudent( req, res );
    }
    else if( filename.substring( 0, 15 ) == "add_enrollment" )
    {
        addEnrollment( req, res );
    }
    else if( filename.substring( 0, 14 ) == "enroll_student" )
    {
        enrollStudent( req, res );
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
    	var contents = fs.readFileSync( filename ).toString();
    }
    catch( e )
    {
    	console.log(
    	    "Error: Something bad happened trying to open " + filename );
        res.writeHead( 404 );
        res.end( "" );
        return;
    }

    res.writeHead( 200 );
    res.end( contents );
}

function listStudents( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html><head><link rel='stylesheet' type='text/css' href='pretty.css'/>" +
	"</head><body><h3>Students</h3>"+
	"<table><tr><th>Name</th><th>Year</th></tr>";
    db.each( "SELECT * FROM STUDENTS", function( err, row ) {
	resp_text += "<tr><td>" + row.Name + "</td><td>" + row.Year + "</td></tr>";
    });
    db.close(
	   function() {
	       resp_text += "</table></body></html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   });
}

function listClasses( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html><head><link rel='stylesheet' type='text/css' href='pretty.css'/>" +
	"</head><body><h3>Classes</h3>"+
	"<table><tr><th>Name</th><th>Department</th></tr>";
    db.each( "SELECT * FROM CLASSES", function( err, row ) {
	resp_text += "<tr><td>" + row.Name + "</td><td>" + row.Department + "</td></tr>";
    });
    db.close(
	   function() {
	       resp_text += "</table></body></html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   });
}

function listTeachers( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html><head><link rel='stylesheet' type='text/css' href='pretty.css'/>" +
	"</head><body><h3>Teachers</h3>"+
	"<table><tr><th>Name</th><th>Office</th></tr>";
    db.each( "SELECT * FROM TEACHERS", function( err, row ) {
	resp_text += "<tr><td>" + row.Name + "</td><td>" + row.Office + "</td></tr>";
    });
    db.close(
	   function() {
	       resp_text += "</table></body></html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   });
}

function listEnrollments( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html><head><link rel='stylesheet' type='text/css' href='pretty.css'/>" +
	"</head><body><h3>Enrollments</h3>"+
	"<table><tr><th>Class Name</th><th>Student Name</th></tr>";
    db.each( "SELECT STUDENTS.NAME as sname, * FROM ENROLLMENTS " +
             "JOIN STUDENTS ON STUDENTS.ID = ENROLLMENTS.STUDENTSID " +
	     "JOIN CLASSES ON CLASSES.ID = ENROLLMENTS.CLASSID ", function( err, row ) {
	resp_text += "<tr><td>" + row.Name + "</td><td>" + row.sname + "</td></tr>";
    });
    db.close(
	   function() {
	       resp_text += "</table></body></html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   });
}

function listAssignments( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html><head><link rel='stylesheet' type='text/css' href='pretty.css'/>" +
	"</head><body><h3>Teacher Assignments</h3>"+
	"<table><tr><th>Class Name</th><th>Teacher Name</th></tr>";
    db.each( "SELECT TEACHERS.NAME as tname, * FROM TEACHINGASSIGNMENTS " +
	     "JOIN TEACHERS ON TEACHERS.ID = TEACHINGASSIGNMENTS.TEACHERID "+
	     "JOIN CLASSES ON CLASSES.ID = TEACHINGASSIGNMENTS.CLASSID", function( err, row ) {
	resp_text += "<tr><td>" + row.Name + "</td><td>" + row.tname + "</td></tr>";
    });
    db.close(
	   function() {
	       resp_text += "</table></body></html>";
	       res.writeHead( 200 );
	       res.end( resp_text );
	   });
}

function addEnrollment( req, res )
{
    var clasName  = []; 
    var studentName = [];

    var db = new sqlite.Database( "school.sqlite" );
    var resp_text = "<!DOCTYPE html>"+
	"<html><head><link rel='stylesheet' type='text/css' href='pretty.css'/>" +
	"</head><body><h3>Enroll A Student</h3>";
    db.each( "SELECT * FROM CLASSES", function( err, row ) {
	 clasName.push([row.Name,row.Id]);
    });

    db.each( "SELECT * FROM STUDENTS", function( err, row ) {
	 studentName.push([row.Name, row.Id]);
    });
    db.close(
	function(){
	  resp_text+= "<form action='enroll_student'><p>Class Name: <select name='class'>";
          for(var i =0; i< clasName.length; i++){
		resp_text += "<option value='" + clasName[i][1] + "'>" + clasName[i][0] + "</option>";
	   }
          resp_text+="</select></p><p>Student Name: <select name='student'>";

          for(var i =0; i< studentName.length; i++){
		resp_text += "<option value='" + studentName[i][1] + "'>" + studentName[i][0] + "</option>";
	   }
          resp_text+="</select></p><input type='submit' value='Enroll Student'/></form></body></html>";
          res.writeHead( 200 );
	  res.end( resp_text );
	});

   
}

function addStudent( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var form_text = req.url.split( "?" )[1];
    var form_inputs = form_text.split( "&" );

    var student_input = form_inputs[0].split( "=" );
    var year_input = form_inputs[1].split( "=" );
    var year = year_input[1];

    var student = decodeURIComponent( ( student_input[1] + '' ).replace( /\+/g, '%20' ) );
    var sql_cmd = "INSERT INTO STUDENTS ('NAME', 'YEAR') VALUES ('"+
        student +"', '" + year + "')";
    db.run( sql_cmd );
    db.close();
    res.writeHead( 200 );
    res.end( "<html><body>Added Student</body></html>" );
}

function enrollStudent( req, res )
{
    var db = new sqlite.Database( "school.sqlite" );
    var form_text = req.url.split( "?" )[1];
    var form_inputs = form_text.split( "&" );

    var class_input = form_inputs[0].split( "=" );
    var student_input = form_inputs[1].split( "=" );

    var sql_cmd = "INSERT INTO ENROLLMENTS ('ClassId', 'StudentsId') VALUES ('"+
        class_input[1] +"', '" + student_input[1] + "')";
    db.run( sql_cmd );
    db.close();
    res.writeHead( 200 );
    res.end( "<html><body>Enrolled Student</body></html>" );
}


var server = http.createServer( serverFn );

server.listen( 8080 );
