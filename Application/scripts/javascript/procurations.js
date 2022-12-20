"use_strict";

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