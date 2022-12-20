<?php

  $inscrits = htmlspecialchars($_GET["inscrits"]);
  $listInscrits = preg_split("/,/", $inscrits);
  array_pop($listInscrits);

  $jsonString = file_get_contents("identifiants.geojson");
  //identifiants.geojson contient tt les identifiants
  $data = json_decode($jsonString, true);
  //data contient tt le contenu de identifiants.geojson sous la forme d'un array

  $listLogin = array();
  foreach ($data as [$login, $mdp]) {
    array_push($listLogin, $login);
  }

  $result = array();
  $result = array_diff($listLogin, $listInscrits);

  asort($result);

  echo json_encode($result);
  
?>