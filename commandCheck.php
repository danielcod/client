<?
	/*ini_set('display_startup_errors',1);
	ini_set('display_errors',1);
	error_reporting(-1);*/
	
	require_once ('includes/mysql-connect.php'); //connect to the database
	
	if (isset($_GET['id']) && isset($_GET['s'])) {
		$ua = $_SERVER["HTTP_USER_AGENT"];
		$ipaddr = $_SERVER['REMOTE_ADDR'];
		$user = $_GET['id'];
		$player = $_GET['s'];

		$query = "SELECT restart FROM onpar.sl_players WHERE user_id='$user' AND player_id='$player'";
		$result = @mysql_query ($query); //run the query on the db

		if (mysql_num_rows($result)) {
			while ($row = mysql_fetch_array ($result, MYSQL_ASSOC)) {
			echo $row['restart'];
			
			$update = "UPDATE onpar.sl_players SET restart='0', player_ipaddr='$ipaddr', player_user_agent='$ua', last_connect=NOW() WHERE user_id='$user' AND player_id='$player'";
			$result2 = @mysql_query ($update); //run the query on the db
			exit();
			}
		} else {	
			echo '0';
			exit();
		}
	} else {
		header("Location: http://www.onpar.tv");
		exit();
	}
		
?>