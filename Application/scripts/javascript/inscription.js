"use_strict";

function I_Inscription() {

  document.getElementById('Connexion').disabled = true;

  $("#Application").append("<fieldset id='Inscription'><legend>Inscription</legend><table><tr><td>Login:</td><td><input type='text' id='loginU' required></td><td> ',' , ';' , '/' interdits </td></tr><tr><td>Mot de passe:</td><td><input type='password' id='mdpU' required minlength='6'></td><td> Minimum 6 caractères</td></tr><tr><td>Confirmation:</td><td><input type='password' id='Cmdp' required></td></tr></table><button class='bouton_generique' onclick=Inscription()> S'inscrire </button><button class='bouton_generique retour' onclick='R_Inscription()'> Annuler </button><div id ='message_Insc' class='warning'></div></fieldset>")
}

function R_Inscription() {
  $("#Inscription").remove();
  document.getElementById('Connexion').disabled = false;
}

function Inscription() {

  //On verifie ce que l'utilisateur a entré
  if ($("#loginU").val() == "" || $("#mdpU").val() == "") {
    $("#message_Insc").removeClass("message").addClass("warning")
    $("#message_Insc").html("Veuillez remplir les champs");
  } else if ($("#mdpU").val() != $("#Cmdp").val()) {
    $("#message_Insc").removeClass("message").addClass("warning")
    $("#message_Insc").html("Confirmation incorrecte");
  } else if ($("#loginU").val().includes(",") || $("#loginU").val().includes(";") || $("#loginU").val().includes("/")) {
    $("#message_Insc").removeClass("message").addClass("warning")
    $("#message_Insc").html("Les caractères ',' , ';' , '/' sont interdits dans le login");
  } else if ($("#mdpU").val().length < 6) {
    $("#message_Insc").removeClass("message").addClass("warning")
    $("#message_Insc").html("Le mot de passe doit avoir au moins 6 caractères");
  } else {
    //tout est bon, on lance l'appel
    let identifiants = [$("#loginU").val(), $("#mdpU").val()];

    $.ajax({
      method: "GET",
      dataType: "json",
      url: "inscription.php",
      data: { "identifiants": identifiants }
    }).done(function (obj) {
      if (obj) {
        $("#message_Insc").removeClass("warning").addClass("message")
        $("#message_Insc").html("Inscription réussie")
        $("#Inscription .retour")[0].innerHTML = "Retour"
      } else {
        $("#message_Insc").removeClass("message").addClass("warning")
        $("#message_Insc").html("Identifiants indisponibles ou déjà utilisés")
      }

    }).fail(function (obj) {
      console.log(obj);
      $("#message_A").html("Error: network problem");
    });
  }
}