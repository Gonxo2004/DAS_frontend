function compararContraseñas() {
    const pass1 = document.getElementById("contraseña");
    const pass2 = document.getElementById("contraseña2");
    const error_msg = document.getElementById("error_msg");
  
    if (pass1.value !== pass2.value) {
      error_msg.textContent = "Las contraseñas no coinciden";
      pass1.style.borderColor = "red";
      pass2.style.borderColor = "red";
      return false; 
    } else {
      error_msg.textContent = "";
      pass1.style.borderColor = null;
      pass2.style.borderColor = null;
      return true; 
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const pass1 = document.getElementById("contraseña");
    const pass2 = document.getElementById("contraseña2");
  
    pass1.addEventListener("input", compararContraseñas);
    pass2.addEventListener("input", compararContraseñas);
  });
  