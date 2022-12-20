<?php

  $login = htmlspecialchars($_GET["login"]);

  $lesScrutins = scandir("scrutins");
  array_shift($lesScrutins);
  array_shift($lesScrutins);
  $participant = array();
  $organisateur = array();

  foreach ($lesScrutins as $i => $scrutin) {

    $jsonString = file_get_contents("scrutins/".$scrutin);
    $data = json_decode($jsonString, true);
    
    if($login == $data[0]){
      array_push($organisateur, str_replace(".json", "", $scrutin));
    }else{
      foreach ($data[1] as $j => $member) {
        if($member[0] == $login){
          array_push($participant,  str_replace(".json", "", $scrutin));
          break 1;
        }
      }
    }
    
  }
  
  echo json_encode(array($organisateur,$participant));
?>