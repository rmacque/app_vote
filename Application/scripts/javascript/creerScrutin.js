"use_strict";

function I_creerScrutin(login) {
  document.querySelectorAll('.debutApp').forEach(e => e.disabled = true);

  //<button class='bouton_generique' onclick='liste'>Mes Listes</button>

  $("#Application").append("<fieldset id='creationScrutin'><legend>Créer un Scrutin</legend><table><tr><td>Question : </td><td colspan=3><input type='text' id='question' required> ?</td></tr><tr><td>Liste des votants :</td><td><ul><li><input type='text' class='votant' value=" + login + " disabled></li><li><select class='votant'></select></li><li class='bAjoutRetrait'><button class='bouton_generique plus' onclick='ajouter_votant()'>+</button><button class='bouton_generique moins' onclick='retirer_votant()'>-</button></li></ul><button class='bouton_generique' onclick='procuration()'>Procurations</button></td><td> Choix possibles :</td><td><ol class='Liste_choix'><li><input type='text' class='choix_possible' value='oui' required></li><li><input type='text' class='choix_possible' value='non' required></li><li class='bAjoutRetrait'><button class='bouton_generique plus' onclick='ajouter_choix()'>+</button><button class='bouton_generique moins' onclick='retirer_choix()'>-</button></li></ol></td></table><button class='bouton_generique' onclick=creerScrutin()> Créer le scrutin </button><button class='bouton_generique retour' onclick='R_creerScrutin()'> Annuler </button><div id='message_CrScrutin'></div></fieldset>")

  let listVotants = document.querySelectorAll(".votant")[0].value + ","

  $.ajax({
    method: "GET",
    dataType: "json",
    url: "nonVotants.php",
    data: { "inscrits": listVotants }
  }).done(function (obj) {
    console.log(obj)
    let ope = document.querySelectorAll("#creationScrutin select")[0]
    for (let i in obj) {
      ope.innerHTML += "<option>" + obj[i] + "</option>"
    }
  }).fail(function (e) {
    console.log(e);
    $("#message_A").html("Error: network problem");
  });
}

function ajouter_votant() {

  let listVotants = document.querySelectorAll(".votant, .procuration")
  let inscrits = ""
  listVotants.forEach(e => inscrits += (e.value + ","));

  $.ajax({
    method: "GET",
    dataType: "json",
    url: "nonVotants.php",
    data: { "inscrits": inscrits }
  }).done(function (obj) {
    if (obj.length != 0) {
      //on retire les boutons 
      $("ul .bAjoutRetrait")[0].remove()

      /*Ajout du select*/
      $("#creationScrutin ul").append("<li class='votantAjoute'><select class='votant'></select></li>");

      /*On remplit le select*/
      let votantsSupp = $("#creationScrutin select");
      let ope = votantsSupp[votantsSupp.length - 1];
      //ope est le dernier <select> créé
      for (let i in obj) {
        ope.innerHTML += "<option>" + obj[i] + "</option>"
      }

      //Desactive l'elément précedent
      if (votantsSupp[votantsSupp.length - 2] != "undefined") {
        votantsSupp[votantsSupp.length - 2].disabled = true;
      }

      //Ajout des boutons
      $("#creationScrutin ul").append("<li class='bAjoutRetrait'><button class='bouton_generique plus' onclick='ajouter_votant()'>+</button><button class='bouton_generique moins' onclick='retirer_votant()'>-</button></li>");

    } else {
      $("#message_CrScrutin").removeClass("message").addClass("warning")
      $("#message_CrScrutin").html("Tout les membres sont inscrits")
    }
  }).fail(function (e) {
    console.log(e);
    $("#message_A").html("Error: network problem");
  });
}

function retirer_votant() {
  let tab = $("#creationScrutin .votantAjoute")
  if (tab.length >= 1) {
    tab[tab.length - 1].remove()
  }
  //active le dernier votant ajouté
  $(".votant")[$(".votant").length - 1].disabled = false
}

function ajouter_choix() {
  let tab = $(".choix_possible")

  //On verifie que le dernier choix n'est pas vide
  if (tab[tab.length - 1].value != "") {

    //on retire les boutons
    $("ol .bAjoutRetrait")[0].remove()

    //On ajoute un choix vierge
    $(".Liste_choix").append("<li class='choixAjoute'><input type='text' class='choix_possible' required></li>");

    //on ajoute les boutons
    $(".Liste_choix").append("<li class='bAjoutRetrait'><button class='bouton_generique plus' onclick='ajouter_choix()'>+</button><button class='bouton_generique moins' onclick='retirer_choix()'>-</button></li>")
  }
}

function retirer_choix() {
  let tab = $("#creationScrutin .choixAjoute")
  if (tab.length >= 1) {
    tab[tab.length - 1].remove()
  }
}

function procuration() {
  //Desactivation des autres éléments
  for (let element of $(".plus, .moins")) {
    element.disabled = true
  }
  $("[onclick='procuration()']")[0].disabled = true
  $("[onclick='creerScrutin()']")[0].disabled = true
  $("[onclick='R_creerScrutin()']")[0].disabled = true
  let tab2 = $(".votant")
  tab2[tab2.length - 1].disabled = true

  let votants = []
  for (let element of tab2) {
    votants.push(element.value)
  }

  if (votants.length - 1 < 2) {
    $("#message_CrScrutin").html("Il n'y a pas assez de votants pour une procuration")
    for (let element of $(".plus, .moins")) {
      element.disabled = false
    }
    $("#I_procuration").remove()
    $("[onclick='procuration()']")[0].disabled = false
    let tab2 = $(".votant")
    tab2[tab2.length - 1].disabled = false
  } else {

    $("#creationScrutin tbody").append("<tr id='I_procuration'><td></td><td colspan= 2><select id='donneur'></select> donne procuration à <select id='receveur'></select></td><td><button onClick='validerProcuration()' class='bouton_generique'>Valider</button><button onClick='annulerProcuration()' class='bouton_generique'>Annuler</button></td></tr>")

    //On remplit les <select>, 
    for (let element of votants) {
      $("#receveur").append("<option>" + element + "</option>")
    }
    votants.shift()//sert à éliminer l'organisateur du srcutin des donneurs de procuration
    for (let element of votants) {
      $("#donneur").append("<option>" + element + "</option>")
    }
  }
}

function validerProcuration() {
  let donneur = $("#donneur").val()
  let receveur = $("#receveur").val()

  if (donneur != receveur) {
    for (e of $("ul li")) {
      if ($(e.innerHTML).val() == receveur) {
        if (e.querySelectorAll(".procuration").length < 2) {
          e.append($("<input type='text' class='procuration' value=" + donneur + " disabled=true>")[0])
        } else {
          $("#message_CrScrutin").removeClass("message").addClass("warning")
          $("#message_CrScrutin").html("Un votant ne peut avoir plus  de 2 procurations")
          break;
        }
      }
      if ($($(e).html()).val() == donneur) {
        e.remove()
      }
    }

    //On reactive les autres elements
    for (let element of $(".plus, .moins")) {
      element.disabled = false
    }
    $("#I_procuration").remove()
    $("[onclick='procuration()']")[0].disabled = false
    $("[onclick='creerScrutin()']")[0].disabled = false
    $("[onclick='R_creerScrutin()']")[0].disabled = false
    let tab2 = $(".votant")
    tab2[tab2.length - 1].disabled = false
  } else {
    $("#message_CrScrutin").removeClass("message").addClass("warning")
    $("#message_CrScrutin").html("Sélectionnez le receveur de la procuration")
  }
}

function annulerProcuration() {
  for (let element of $(".plus, .moins")) {
    element.disabled = false
  }
  $("#I_procuration").remove()
  $("[onclick='procuration()']")[0].disabled = false
  let tab2 = $(".votant")
  tab2[tab2.length - 1].disabled = false
  $("#message_CrScrutin").html("")
}

function R_creerScrutin() {
  //  .remove(), .prop(), .detach();
  $("#creationScrutin").remove();
  document.querySelectorAll('.debutApp').forEach(element => element.disabled = false)
}

function creerScrutin() {
  let question = $("#question").val()

  let listVotants = $("#creationScrutin ul li")
  listVotants.length -= 1
  let inscrits = ""
  let listProcurations = $(".procuration")

  for (e of listVotants) {
    //$(e.innerHTML).val() est le nom du votant
    //$(e.innerHTML).length est le nb de fois qu'il vote
    inscrits += $(e.innerHTML).val() + "," + $(e.innerHTML).length
    inscrits += ";"
  }

  for (e of listProcurations) {
    inscrits += e.value + ",0"
    inscrits += ";"
  }

  let organisateur = $(listVotants[0].innerHTML)[0].value;
  let listChoix = document.querySelectorAll(".choix_possible")
  let choix = ""
  listChoix.forEach(e => choix += (e.value + ","));


  if (question == "") {
    $("#message_CrScrutin").html("Question manquante")
  } else {

    $.ajax({
      method: "GET",
      dataType: "json",
      url: "creerScrutin.php",
      data: { "question": question, "inscrits": inscrits, "choix": choix, "organisateur": organisateur }
    }).done(function (obj) {
      if (obj) {
        $("#message_CrScrutin").removeClass("warning").addClass("message")
        $("#message_CrScrutin").html("Scrutin créé")
        $("#creationScrutin .retour")[0].innerHTML = "Retour"
      } else {
        $("#message_CrScrutin").removeClass("message").addClass("warning")
        $("#message_CrScrutin").html("Ce Scrutin existe déjà")
      }
    }).fail(function (e) {
      console.log(e);
      $("#message_A").html("Error: network problem");
    });
  }
}