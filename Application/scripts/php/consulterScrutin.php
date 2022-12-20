<?php

  $kgv = htmlspecialchars($_GET["login"]);
  $lesScrutins = scandir("scrutins");
  array_shift($lesScrutins);
  array_shift($lesScrutins);
  $participant = array();
  $organisateur = array();

  function selection($nom){
    $jsonString = file_get_contents("../../scrutins/".$nom);
    $data = json_decode($jsonString, true);

    $kgv = htmlspecialchars($_GET["login"]);

    echo json_encode($kgv);

    /*
    if(in_array($login, $data)){
      if($login == $data[0]){
        array_push($organisateur, $nom);
      }else{
        array_push($participant, $nom);
      }
    }*/
    
  }
  
  array_map("selection", $lesScrutins);

  //echo json_encode(array($organisateur,$participant));
  
?>