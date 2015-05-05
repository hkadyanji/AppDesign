var fs = require( "fs" );

var args = process.argv;

if(args.length != 3){
 
 console.log("Please specify only one file");
 process.exit(1);
}

var lines = "";

try{

 lines = fs.readFileSync( args[2] ).toString().split( "\n" );
}
catch(e){

  console.log(e);
}

var targets = {};

for( var i = 0; i < lines.length-1; i++ )
{
    var target = {};
    var line = lines[ i ];
    console.log( line );
    
    if( !line.match(/:/)){
        console.log("There are format errors in the input file");
	return;
     }

    var colon = line.split( ":" );
    if( colon.length != 2 )
    {
        continue;
    }

    if(target.name === null || target.depend_names === null || target.visited === null){
        console.log("There's no target for a dependency");
        return;
    }

    target.name = colon[ 0 ];
    target.depend_names = colon[ 1 ].split( " " );

    
    target.visited = false;
    targets[ target.name ] = target;
}

console.log( targets );

function trace_dependencies( prev, target )
{

    if( typeof prev !== "string")
    {
        console.log("Prev and/or target are not the right type of input");
        return;
    }


    if( target.visited)
    {
        console.log( "Already visited " + target.name );
        return;
    }

    target.visited = true;
    console.log( "> " + prev + " depends on " + target.name );
    for( var i = 0; i < target.depend_names.length; i++ )
    {
        var dep_name = target.depend_names[ i ];
        if( !( dep_name in targets ) )
            continue;
        var dep = targets[ dep_name ];
        // if( date( dep ) older than date( target ) )
        //    continue;
        trace_dependencies( target.name, dep );
        // trace_dependencies( {l:12, m:34}, "hello" );
    }
}

try{
  trace_dependencies( "[ Start ]", targets[ args[2] ] );

}catch(e){

 console.log(e);
}

