<?php
	$ctx = context::get();
	$db = $ctx->db;
	$user = $ctx->user;
	
	$data = null;
	
/******************************************************************************
 * Handle request
 ******************************************************************************/
	
	$type = array_key_exists("type", $_REQUEST) ? $_REQUEST["type"] : null;
		
	if ($user->loggedIn->type == UT_ADMIN) {
		if ($type == 'editMatch') {
			$my_foot = new foot($db);
			$match = $_REQUEST['match'];
			$data = $my_foot->setMatchScore(
					$match['id'],
					checkedScore($match['score1']),
					checkedScore($match['score2'])
				);
		} elseif ($type == 'setRanks') {
			$my_foot = new foot($db);
			$group = $_REQUEST['group'];
			$data = $my_foot->setRanks(
					$group['id'],
					explode('-', $group['ranks'])
			);
		}
	}
	
/******************************************************************************
 * Input validation
 ******************************************************************************/
	 
	 function checkedScore($s) {
	 	if ($s == "0") return 0;
	 	$s = intval($s);
	 	return ($s == 0) ? 'NULL' : $s;
	 }
	 
/******************************************************************************
 * End process
 ******************************************************************************/
	 
	$db->close();
	
	header('Content-Type: application/javascript');
	echo json_encode($data);
	exit;
?>