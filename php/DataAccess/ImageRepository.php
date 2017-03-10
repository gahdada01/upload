<?php
	require_once('../DataAccess/DataContext.php');
	require_once('../Model/Art.php');

	class ImageRepository{
		protected $db;

		public function __construct(){
			$this->db = new ImageWeb();
		}

		public function GetList($creator_id){
			$query_string = "SELECT * FROM `art_tb` WHERE `creator_id` = " . $creator_id . " ORDER BY `id` ASC";

			if($query = $this->db->query($query_string)){
				$array = array();

				while($result = $query->fetchArray(SQLITE3_ASSOC)){
					array_push($array, $result);
				}
			}

			return $array;
		}

		public function ClearDatabase(){
			$query_string = "DELETE FROM `art_tb`";

			$query = $this->db->exec($query_string);

			if($query){
				return "Database cleared.";
			}
			else{
				return "Error.";
			}
		}

		public function UploadFile($fileData, $filename){
			if(move_uploaded_file($fileData, "../../images/" . $filename)){
				return 1;
			}
			else{
				return 0;
			}
		}

		public function Update($file_id, $flag){
			$query_string = "UPDATE `art_tb` SET `flag` = " . $flag . " WHERE `id` = " . $file_id;

			$query = $this->db->exec($query_string);

			if($query){
				return true;
			}
			else{
				return "Error. Unable to update data.";
			}
		}

		public function Delete($file_id, $filename){
			$query_string = "SELECT `creator_id` FROM `art_tb` WHERE `id` = " . $file_id . " LIMIT 1;";

			if($query = $this->db->query($query_string)){
				$array = array();

				while($result = $query->fetchArray(SQLITE3_ASSOC)){
					$creator_id = $result['creator_id'];
					break;
				}

				$query_string = "DELETE FROM `art_tb` WHERE `id` = " . $file_id;

				$query = $this->db->exec($query_string);

				if($query){
					if(unlink("../../images/" . $creator_id . "/" . $filename)){
						return true;
					}
					else{
						return "Error. Unable to delete physical file.";
					}
				}
				else{
					return "Error. Unable to delete data in database.";
				}

			}
			else{
				return "Error. Select.";
			}
		}

		public function Save(Art $art){
			$creator_id = $art->creator_id;
			$filetype = $art->filetype;
			$filesize = $art->filesize;
			$flag = $art->flag;
			$register_date = $art->register_date;

			$select_string = "SELECT MAX(`id`) FROM `art_tb` LIMIT 1;";

			if($query = $this->db->query($select_string)){

				while($result = $query->fetchArray(SQLITE3_ASSOC)){
					$result_id = $result['MAX(`id`)'];
				}

				if($result_id != null){
					$id = $result_id + 1;
				}
				else{
					$id = 1;
				}

				$filename = $creator_id . "_" . $id . $filetype;

				$query_string = "INSERT INTO `art_tb` (`id`, `creator_id`, `filename`, `flag`, `filesize`, `register_date`) VALUES ($id, $creator_id, '$filename', $flag, $filesize, '$register_date')";

				if($this->db->exec($query_string)){
					return $filename;
				}
				else{
					return false;
				}

			}
			else{
				return false;
			}

		}

	}

?>