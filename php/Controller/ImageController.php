<?php
	require_once('../DataAccess/ImageRepository.php');

	$image_array = json_decode($_POST['image_array'], true);
	$transaction_type = $_POST['transaction_type'];
	$creator_id = $_POST['creator_id'];
	$id = $_POST['id'];
	$filename = $_POST['filename'];
	$flag = $_POST['flag'];

	$imageRepository = new ImageRepository();

	if($transaction_type == 'save'){
		$art = new Art();
		$art->creator_id = $image_array[0]['creator_id'];
		$art->flag = $image_array[0]['flag'];
		$art->filesize = $image_array[0]['filesize'];
		$art->filetype = $image_array[0]['filetype'];
		$art->register_date = date('Y-m-d H:i:s', time());

		$result = $imageRepository->Save($art);

		echo json_encode($result);
	}
	elseif ($transaction_type == 'batch_save') {
		$current_date = date('Y-m-d H:i:s', time());
		$isSuccess = true;

		$count = count($image_array);
		$index = 0;

		foreach($image_array as $item){
			$art = new Art();
			$art->creator_id = $item['creator_id'];
			$art->flag = $item['flag'];
			$art->filesize = $item['filesize'];
			$art->filetype = $item['filetype'];
			$art->register_date = $current_date;

			$result = $imageRepository->Save($art);

			if($result == false){
				$isSuccess = false;
				echo json_encode('Failed to save image. Operaton aborted.');
				break;
			}
			else{
				if (!is_dir("../../images/" . $art->creator_id)) {
					mkdir("../../images/" . $art->creator_id);         
				}

				if(move_uploaded_file($_FILES['file_array_' . $index]['tmp_name'], "../../images/" . $art->creator_id . "/" . $result)){
					copy("../../images/" . $art->creator_id . "/" . $result, "../../images/generic/" . $result);
					$index++;
				}
				else{
					$isSuccess = false;
					echo json_encode('Failed to upload image. Operaton aborted.');
					break;
				}
			}

		}

		if($isSuccess){
			echo json_encode('Successfully saved images.');
		}

	}
	elseif ($transaction_type == 'get_list'){
		$result = $imageRepository->GetList($creator_id);

		echo json_encode($result);
	}
	elseif($transaction_type == 'update'){
		$result = $imageRepository->Update($id, $flag);

		echo json_encode($result);
	}
	elseif ($transaction_type == 'delete'){
		$result = $imageRepository->Delete($id, $filename);

		echo json_encode($result);
	}
	else{
		echo json_encode('Transaction invalid!');
	}
	
?>