<?php

	require_once('../DataAccess/DataContext.php');
	require_once('../DataAccess/ImageRepository.php');

	$imageRepo = new ImageRepository();

	$result = $imageRepo->GetList($creator_id);
		

	echo json_encode($result);


?>