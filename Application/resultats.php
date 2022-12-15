<?php

  $nomScrutin = htmlspecialchars($_GET["nomScrutin"]);
  $jsonString = file_get_contents("./scrutins/$nomScrutin.json");
  $data = json_decode($jsonString, true);

  echo json_encode($data[2]);

?>