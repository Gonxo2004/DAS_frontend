function changeImage(newSrc) {
    const mainImage = document.getElementById("mainImage");
    mainImage.src = newSrc;
  }

function bidMessage(minimunBid , currentBid){ 
    bidMessage_text = document.getElementById("bid_message");

    if (minimunBid > currentBid) {
        bidMessage_text.textContent = "La puja debe ser mayor a " + minimunBid + "€";
        bidMessage_text.style.color = "red";
        return;
    }
    
    bidMessage_text.textContent = "Puja realizada con exito!!";
    bidMessage_text.style.color = "green";
  
}