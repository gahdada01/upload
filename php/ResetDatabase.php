<?php

	date_default_timezone_set('Asia/Tokyo');

	$database = new SQLite3('DataAccess/ImageWeb.sqlite');

	class ImageWeb extends SQLite3
	{
		function __construct()
		{
			$this->open('DataAccess/ImageWeb.sqlite');
		}
	}

	$db = new ImageWeb();

	$sql = "CREATE TABLE art_tb (
		id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
		creator_id INT NOT NULL, 
		filename TEXT NOT NULL,
		filesize INT NOT NULL,
		flag INT NOT NULL, 
		register_date DATETIME NOT NULL);";
		
	$ret = $db->exec($sql);

	if(!$ret){
		echo $db->lastErrorMsg();
	} else {
		echo "Table created successfully\n";
	}

	$db->close();

	// $sql = "DELETE * FROM `art_tb`";

	// $ret = $db->exec($sql);

	// $database = new SQLite3('DataAccess/ImageWeb.sqlite');

	/*

	date_default_timezone_set('Asia/Tokyo');

	class ImageWeb extends SQLite3
	{
		function __construct()
		{
			$this->open('DataAccess/ImageWeb.sqlite');
		}
	}

	$db = new ImageWeb();
	
	if(!$db){
		echo $db->lastErrorMsg();
	} else {
		
		$current_date = date('Y-m-d H:i:s', time());

		$sql = "INSERT INTO `art_tb`('id', 'creator_id', 'file_name', 'flag', 'register_date')
				VALUES (2, 1, 'watattops.jpg', 1, '$current_date')";

		$ret = $db->exec($sql);

		// if(!$ret){
		// 	echo $db->lastErrorMsg();
		// } else {
		// 	echo "Table created successfully\n";
		// }

		$query_string = "SELECT * FROM `art_tb`";

		// $ret = $db->query($query_string);

		// while($row = $ret->fetchArray(SQLITE3_ASSOC) ){
		// 	echo "ID = ". $row['id'] . "\n";
		// 	echo "NAME = ". $row['creator_id'] ."\n";
		// 	echo "ADDRESS = ". $row['file_name'] ."\n";
		// 	echo "SALARY =  ".$row['flag'] ."\n\n";
		// 	echo "SALARY =  ".$row['register_date'] ."\n\n";
		// }

		if($query = $db->query($query_string)){
			$array = array();

			while($result = $query->fetchArray(SQLITE3_ASSOC)){
				array_push($array, $result);
			}
		}

		echo json_encode($array);

		$db->close();

	}

	

	$sql = "CREATE TABLE art_tb (
		id INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
		creator_id INT NOT NULL, 
		file_name TEXT NOT NULL, 
		flag INT NOT NULL, 
		register_date DATETIME NOT NULL);";
		
	$ret = $db->exec($sql);

	if(!$ret){
		echo $db->lastErrorMsg();
	} else {
		echo "Table created successfully\n";
	}

	$db->close();

	*/

?>