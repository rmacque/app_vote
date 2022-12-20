"use_strict";

function connexion() {
  if ($("#login").val() == "" || $("#mot_de_passe").val() == "") {
    //let a = document.querySelectorAll(".bouton_generique");
    $("#message_C").text("Veuillez remplir tous les champs")
  } else {
    document.getElementById("message_C").innerHTML = "";
    let identifiants = [$("#login").val(), $("#password").val()]

    $.ajax({
      method: "GET",
      dataType: "json",
      url: "scripts/php/connexion.php",
      data: { "identifiants": identifiants }
    }).done(function (obj) {
      if (obj) {
        $("#Application").append("<button class='bouton_generique debutApp' onclick='I_creerScrutin(\"" + $("#login").val() + "\")'> Créer un Scrutin </button><button class='bouton_generique debutApp' onclick='mesScrutins(\"" + $("#login").val() + "\")'> Mes Scrutins </button><button id='deconnexion' class='bouton_generique' onclick='deconnexion()'> Se Déconnecter </button>");
        $("#Connexion").remove()
      } else {
        $("#mot_de_passe").val("")
        $("#message_C").text("Mot de passe ou identifiant incorrect");
      }
    }).fail(function (e) {
      console.log(e);
      $("#message_A").html("Error: network problem");
    });
  }
}

function deconnexion() {
  $(".debutApp").remove();
  $("#creationScrutin").remove();
  $("#scrutinsO, #scrutinsP, .scrutinsU").remove()
  $("#deconnexion").remove();
  $("#Scrutin").remove();
  $("#Application").append("<fieldset id='Connexion'><legend>Connexion</legend><table><tr><td>Login:</td><td><input type='text' id='login' value='' required></td></tr><tr><td>Mot de passe:</td><td><input type='password' id='password' value=''></td></tr></table><button class='bouton_generique' onclick='connexion()'> Se Connecter </button><button class='bouton_generique' onclick='I_Inscription()'> Inscription </button><br><div id ='message_C' class='warning'></div></fieldset>")
}