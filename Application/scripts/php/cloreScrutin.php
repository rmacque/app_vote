<?php

  $titre = htmlspecialchars($_GET["titre"]);

  $jsonString = file_get_contents("../../scrutins/$titre.json");
  $data = json_decode($jsonString, true);

  $data[3] = false;
  
  $jsonString = json_encode($data);
  file_put_contents("./scrutins/$titre.json", "$jsonString");

  echo json_encode($data);
?>