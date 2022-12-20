<?php

  $nomScrutin = htmlspecialchars($_GET["nomScrutin"]);
  $jsonString = file_get_contents("./scrutins/$nomScrutin.json");
  $data = json_decode($jsonString, true);

  $organisateur = $data[0];
  $listeVotants = array();
  foreach ($data[1] as $key => $value) {
    array_push($listeVotants, $value[0]);
  }
  $totalDeVotes = count($listeVotants);
  
  $listeChoix = array();
  foreach ($data[2] as $key => $value) {
    array_push($listeChoix, $value[0]);
  }

  //$taux = nb de votes en attente
  $taux = 0;
  foreach ($data[1] as $key => $value) {
    $taux += $value[1];
  }
  $taux /= $totalDeVotes;
  $tauxParticipation = (1-$taux);

  echo json_encode(array($organisateur, $listeVotants, $listeChoix, $tauxParticipation, $data[3]));

?>