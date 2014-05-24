<?php
	$ctx = context::get();
	$db = $ctx->db;
	$user = $ctx->user;
	
	$data = null;
	$my_bets = new bets($db);
	
/******************************************************************************
 * Update Bet
 ******************************************************************************/
	
	$challenge = array_key_exists("challenge", $_REQUEST) ? $_REQUEST["challenge"] : null;
		
	if ($user->loggedIn) {
		if ($challenge == 'champion') {
			$champion = $_REQUEST['champion'];
			$my_bets->enterChampionBet($user->loggedIn->login, $champion);
			
			$data = new stdClass();
			$data->bets = $my_bets->getBets($user->loggedIn->login);
			$data->updated = true;
		} else if ($challenge == 'quarter') {
			$mid = $_REQUEST['mid'];
			$winner = $_REQUEST['winner'];
			$my_bets->enterMatchWinnerBet($user->loggedIn->login, $mid, $winner);
			
			$data = new stdClass();
			$data->bets = $my_bets->getBets($user->loggedIn->login);
			$data->updated = true;
		}
	}
	
/******************************************************************************
 * Input validation
 ******************************************************************************/
	 
/******************************************************************************
 * End process
 ******************************************************************************/
	 
	$db->close();
	
	header('Content-Type: application/json');
	echo json_encode($data);
	exit;
?>