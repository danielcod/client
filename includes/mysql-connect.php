<?
//this file contains the info for accessing the MySQL database, also establishes connection to MySQL and selects a database

//set the database access info as constants
DEFINE ('DB_USER', 'onpar');
DEFINE ('DB_PASSWORD', 'B6EtHu$ecR');
DEFINE ('DB_HOST', 'localhost');

//make the connection
$dbc = @mysql_connect(DB_HOST, DB_USER, DB_PASSWORD) OR die ('Could not connect to MySQL: ' . mysql_error() );

//select the database
//@mysql_select_db(DB_NAME) OR die ('Could not select the database: ' . mysql_error() ); 

//function for escaping data
function escape_data ($data) {
	
	if (ini_get('magic_quotes_gpc')) {
		$data = stripslashes($data);
	}
	
	//check for mysql_real_escape_string() support
	if (function_exists('mysql_real_escape_string')) {
		global $dbc; //need the connection	
		$data = mysql_real_escape_string
		(trim($data), $dbc);
	} else {
		$data = mysql_escape_string
		(trim($data), $dbc);
	}
	
	//return the escaped value
	return $data;
	
} //end of escape_data function	
?>