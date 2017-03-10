<?php
	require_once('../DataAccess/ImageRepository.php');

    $imageRepository = new ImageRepository();

    $result = $imageRepository->GetList(1);

    // $result = $imageRepository->ClearDatabase();

    echo json_encode($result);
?>