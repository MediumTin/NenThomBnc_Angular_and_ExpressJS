// Config for Shopping Bag Button - Number 1
var ShoppingBagButton = document.getElementById("ShoppingBagButton");
ShoppingBagButton.onclick = function(){
    document.getElementById("ShoppingBagLink").click();
}

// Config for Shopping Bag Button - Number 2
var PaymentButton = document.getElementById("PaymentButton");
PaymentButton.onclick = function(){
    document.getElementById("PaymentLink").click();
} 

// Config for Shopping Bag Button - Number 3
var LoginButton = document.getElementById("User_Account");
LoginButton.onclick = function(){
    document.getElementById("LoginLink").click();
} 

// Config for Shopping Bag Button - Number 4
let slideIndex = 0;
let id = 1;
showSlides();
showSlides2();

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex-1].style.display = "block";  
    setTimeout(showSlides, 2000); // Change image every 2 seconds
}

function showSlides2() {
    let a = `Component_${id}`;
    document.getElementById("Component_1").innerHTML = `<img src="../img/Automation/Image/1.jpg" style="width:100%;margin-left:0px;">`;
    id = id + 1;
    setTimeout(showSlides2, 3000);
}

  



