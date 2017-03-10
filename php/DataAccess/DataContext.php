<?php
	date_default_timezone_set('Asia/Tokyo');

	class ImageWeb extends SQLite3
	{
		function __construct()
		{
			$this->open('../DataAccess/ImageWeb.sqlite');
		}
	}
?>