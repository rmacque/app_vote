<?php

  $vote = htmlspecialchars($_GET["vote"]);
  $nomScrutin = htmlspecialchars($_GET["nomScrutin"]);
  $utilisateur = htmlspecialchars($_GET["login"]);
  
  $jsonString = file_get_contents("./scrutins/$nomScrutin.json");
  $data = json_decode($jsonString, true);
  
  
  foreach ($data[1] as $it => $value) {
    if($value[0] == $utilisateur){
      if($value[1] > 0){
        $data[1][$it][1]--;
        $data[2][$vote][1]++;
        
        $taux = 0;
        foreach ($data[1] as $key => $value) {
          $taux += $value[1];//$taux = nb de votes en attente
        }
        $taux /= count($data[1]);
        $taux = 1-$taux;

        if($taux == 1){
          //participation max => on clos automatiquement le srcutin
          $data[3] = false;
        }

        $jsonString = json_encode($data);
        file_put_contents("./scrutins/$nomScrutin.json", "$jsonString");  

        echo json_encode($taux);
      }else{
        echo json_encode(-1);
      }
      break 1;
    }
  }
  
?>