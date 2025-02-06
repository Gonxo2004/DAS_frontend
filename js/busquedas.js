function changeImage(newSrc) {
    const mainImage = document.getElementById("mainImage");
    mainImage.src = newSrc;
  }

function bidMessage(){
    bidMessage_text = document.getElementById("bid_message");
    bidMessage_text.textContent = "Puja realizada con exito!!";
}