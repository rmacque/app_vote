"use_strict";

function mesScrutins(login) {
  document.querySelectorAll('.debutApp').forEach(e => e.disabled = true);
  $.ajax({
    method: "GET",
    dataType: "json",
    url: "scripts/php/mesScrutins.php",
    data: { "login": login }
  }).done(function (obj) {
    $("#Application").append("<br class='scrutinsU'>");

    for (e in obj[0]) {
      $("#Application").append("<button class='bouton_generique scrutinsU organisateur' onclick='I_ScrutinOrganisateur(\"" + obj[0][e] + "\",\"" + login + "\")'>" + obj[0][e] + "</button>")
    }

    $("#Application").append("<br class='scrutinsU'>");

    for (e in obj[1]) {
      $("#Application").append("<button class='bouton_generique scrutinsU participant' onclick='I_ScrutinParticipant(\"" + obj[1][e] + "\",\"" + login + "\")'>" + obj[1][e] + "</button>")
    }

    $("#Application").append("<br class='scrutinsU'><button class='bouton_generique scrutinsU' onclick='R_mesScrutins()'> Retour </button>")

  }).fail(function (e) {
    console.log(e);
    $("#message_A").html("Error: network problem");
    $("#Application").append("<br class='scrutinsU'><button class='scrutinsU' onclick='R_mesScrutins()'> Retour </button>")
  });
}

function R_mesScrutins() {
  $("#scrutinsO, #scrutinsP, .scrutinsU").remove()
  document.querySelectorAll('.debutApp').forEach(e => e.disabled = false);
}

function I_ScrutinOrganisateur(nomScrutin, login) {
  $("#Scrutin").remove()
  document.querySelectorAll('.scrutinsU').forEach(e => e.disabled = true);

  $("#Application").append("<fieldset id='Scrutin'><legend>Scrutin</legend><table><tr><td colspan=4><div id='nomScrutin'>" + nomScrutin + " ?</div></td></tr><tr><td>Liste des votants :</td><td><div class='Liste_votants'></div></td></tr></table><div>Choix :</div><table id='lesVotes'><tr class='Liste_choix'></tr></table><div id='taux'>taux de participation:</div><button class='bouton_generique clore' onclick='cloreScrutin(\"" + nomScrutin + "\")'>Clore le Scrutin</button><button class='bouton_generique' onclick='I_ScrutinOrganisateur(\"" + nomScrutin + "\",\"" + login + "\")'>Actualiser</button><button class='bouton_generique retour' onclick='R_Scrutin()'>Retour</button><button class='bouton_generique' onClick='detruireScrutin(\"" + nomScrutin + "\")' disabled=true>Detruire</button><div id='message_CrScrutin'></div></fieldset>")

  $.ajax({
    method: "GET",
    dataType: "json",
    url: "scripts/php/infoScrutin.php",
    data: { "nomScrutin": nomScrutin }
  }).done(function (obj) {
    for (e in obj[1]) {
      $(".Liste_votants")[0].innerHTML += obj[1][e] + "  |  "
    }

    for (e in obj[2]) {
      $(".Liste_choix")[0].innerHTML += "<td><button class='bouton_generique' onclick='Voter(\"" + e + "\",\"" + nomScrutin + "\",\"" + login + "\")'>" + obj[2][e] + "</button></td>"
    }

    obj[3] *= 100
    $("#taux").text("taux de participation: " + obj[3] + "%")

    if (!obj[4]) {// => Le scrutin est clos

      /*On desactive tt les boutons sauf le retour et on active celui qui permet de detruire le scrutin*/
      document.querySelectorAll(".Liste_choix .bouton_generique").forEach(e => e.disabled = true)
      $("button[onclick='cloreScrutin(\"" + nomScrutin + "\")']")[0].disabled = true
      $("button[onclick='detruireScrutin(\"" + nomScrutin + "\")']")[0].disabled = false
      document.querySelectorAll(".procuration").forEach(e => e.disabled = true)

      //On affiche les résultats
      Resultats(nomScrutin)

      //On informe l'utilisateur
      $("#message_CrScrutin").addClass("warning")
      $("#message_CrScrutin").text("Ce scrutin est clos")
    }
  }).fail(function (e) {
    console.log(e);
    $("#message_A").html("Error: network problem");
  });
}

function I_ScrutinParticipant(nomScrutin, login) {
  $("#Scrutin").remove()
  document.querySelectorAll('.scrutinsU').forEach(e => e.disabled = true);

  $("#Application").append("<fieldset id='Scrutin'><legend>Scrutin</legend><table><tr><td>Organisateur: </td><td id='nomO'></td></tr><tr><td colspan=4><div id='nomScrutin'>" + nomScrutin + " ?</div></td></tr><tr><td>Liste des votants :</td><td><div class='Liste_votants'></div></td></tr></table><div>Choix :</div><table id='lesVotes'><tr class='Liste_choix'></tr></table><div id='taux'></div><button class='bouton_generique' onclick='I_ScrutinParticipant(\"" + nomScrutin + "\",\"" + login + "\")'>Actualiser</button><button class='bouton_generique retour' onclick='R_Scrutin()'>Retour</button><div id='message_CrScrutin'></div></fieldset>")

  $.ajax({
    method: "GET",
    dataType: "json",
    url: "scripts/php/infoScrutin.php",
    data: { "nomScrutin": nomScrutin }
  }).done(function (obj) {

    $("#nomO").text(obj[0])//nom de l'organisateur

    for (e in obj[1]) {
      $(".Liste_votants")[0].innerHTML += obj[1][e] + " | "
    }

    for (e in obj[2]) {
      $(".Liste_choix")[0].innerHTML += "<td><button class='bouton_generique' onclick='Voter(\"" + e + "\",\"" + nomScrutin + "\",\"" + login + "\")'>" + obj[2][e] + "</button></td>"
    }

    obj[3] *= 100
    $("#taux").text("taux de participation: " + obj[3] + "%")

    if (!obj[4]) { // => le scrutin est clos
      Resultats(nomScrutin)//Affiche les résultats
      document.querySelectorAll(".Liste_choix .bouton_generique").forEach(e => e.disabled = true)
      $("#message_CrScrutin").addClass("warning")
      $("#message_CrScrutin").text("Ce scrutin est clos")
    }
  }).fail(function (e) {
    console.log(e);
    $("#message_A").html("Error: network problem");
  });
}

function R_Scrutin() {
  $("#Scrutin").remove()
  document.querySelectorAll('.scrutinsU').forEach(e => e.disabled = false);
}

function Voter(vote, nomScrutin, utilisateur) {
  $.ajax({
    method: "GET",
    dataType: "json",
    url: "scripts/php/voter.php",
    data: { "vote": vote, "nomScrutin": nomScrutin, "login": utilisateur }
  }).done(function (obj) {
    if (obj == (-1)) {
      $("#message_CrScrutin").text("Vous ne pouvez plus voter")
      document.querySelectorAll(".Liste_choix .bouton_generique").forEach(e => e.disabled = true)
    } else {
      $("#taux").text("taux de participation: " + (obj * 100) + "%")
    }

  }).fail(function (e) {
    console.log(e);
    $("#message_A").html("Error: network problem");
  });
}

function cloreScrutin(nomScrutin) {
  $.ajax({
    method: "GET",
    dataType: "json",
    url: "scripts/php/cloreScrutin.php",
    data: { "titre": nomScrutin }
  }).done(function (obj) {
    document.querySelectorAll(".Liste_choix .bouton_generique").forEach(e => e.disabled = true)
    $("button[onclick='cloreScrutin(\"" + nomScrutin + "\")']")[0].disabled = true
    $("button[onclick='detruireScrutin(\"" + nomScrutin + "\")']")[0].disabled = false

    //On affiche les résultats
    Resultats(nomScrutin)

    //On informe l'utilisateur
    $("#message_CrScrutin").text("Ce scrutin est désormais clos")
  }).fail(function (e) {
    console.log(e);
    $("#message_A").html("Error: network problem");
  });
}

function Resultats(nomScrutin) {
  $.ajax({
    method: "GET",
    dataType: "json",
    url: "scripts/php/resultats.php",
    data: { "nomScrutin": nomScrutin }
  }).done(function (obj) {
    $("#lesVotes").append("<tr id='Liste_Resultats'></tr>")
    for (let e in obj) {
      $("#Liste_Resultats").append("<td>" + obj[e][1] + "</td>")
    }
  }).fail(function (e) {
    console.log(e);
    $("#message_A").html("Error: network problem");
  });
}

function detruireScrutin(nomScrutin) {
  $.ajax({
    method: "GET",
    dataType: "json",
    url: "scripts/php/detruireScrutin.php",
    data: { "nomScrutin": nomScrutin }
  }).done(function (obj) {
    if (obj) {
      R_Scrutin()
    } else {
      $("#message_CrScrutin").text("Le scrutin n'a pas pu être supprimé")
    }
  }).fail(function (e) {
    console.log(e);
    $("#message_A").html("Error: network problem");
  });
}