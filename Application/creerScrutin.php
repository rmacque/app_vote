<?php

  $question = htmlspecialchars($_GET["question"]);
  $inscrits = htmlspecialchars($_GET["inscrits"]);
  $choix = htmlspecialchars($_GET["choix"]);
  $organisateur = htmlspecialchars($_GET["organisateur"]);

  $listInscrits = preg_split("/;/", $inscrits);
  array_pop($listInscrits);

  foreach ($listInscrits as $key => $value) {
    $listInscrits[$key] = preg_split("/,/", $value);
  }

  foreach ($listInscrits as $key => $value) {
    $listInscrits[$key][1] = floatval($value[1]);
  }
  
  $listChoix = preg_split("/,/", $choix);
  array_pop($listChoix);

  foreach ($listChoix as $key => $value) {
    $listChoix[$key] = [$value, 0];
  }
  
  if(file_exists("./scrutins/$question.json")){
    echo "false";
  }else{

    $encodage = json_encode([$organisateur,$listInscrits,$listChoix,true]);
    file_put_contents("./scrutins/$question.json","$encodage");
    echo "true";
  }
  
?>