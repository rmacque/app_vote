<?php

  $identifiant = [htmlspecialchars($_GET["identifiants"][0]),htmlspecialchars($_GET["identifiants"][1])];
  $jsonString = file_get_contents('identifiants.geojson');
  //identifiants.geojson contient tt les identifiants
  $data = json_decode($jsonString, true);
  //error_log($tofind);

  $resultat = in_array($identifiant, $data);

  echo json_encode($resultat);
  /*
  $result = array();
  foreach ($features as $i=>$feature){
    if (array_key_exists("name", $feature["properties"]) and strpos($feature["properties"]["name"], $tofind)!==FALSE){
      if (array_key_exists("website", $feature["properties"]))
        array_push($result, array("id"=>$feature["properties"]["@id"], "name"=>$feature["properties"]["name"], "web"=>$feature["properties"]["website"]));
      else
        array_push($result, array("id"=>$feature["properties"]["@id"],"name"=>$feature["properties"]["name"], "coordonees"=>$feature["geometry"]["coordinates"]));
    }
  }
  
  $foundJsonString = json_encode($result);
  echo $foundJsonString;
  */
?>