function compararContraseñas() {
    let password1 = document.getElementById("contraseña").value;
    let password2 = document.getElementById("contraseña2").value;
    let error_msg = document.getElementById("error_msg");

    if (password1 !== password2) {
        error_msg.textContent = "Las contraseñas no coinciden";
        document.getElementById("contraseña").style.borderColor = "red";
        document.getElementById("contraseña2").style.borderColor = "red";
        return false; 
    } else {
        error_msg.textContent = "";
        document.getElementById("contraseña").style.borderColor = null;
        document.getElementById("contraseña2").style.borderColor = null;
        return true; 
    }
}





