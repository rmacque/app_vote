<?php
	$nomScrutin = htmlspecialchars($_GET["nomScrutin"]);
	echo json_encode(unlink("./scrutins/$nomScrutin.json"))
?>