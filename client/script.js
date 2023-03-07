var slideIndex = 0;
// Tells us which slide we are on
var currentSlideIndex = 0;
// An Array to hold all the slides
var slideArray = [];

function Slide(title, subtitle, background, link) {
    this.title = title;
    this.subtitle = subtitle;
    this.background = background;
    this.link = link;
    // we need an id to target later using getElementById
    this.id = "slide" + slideIndex;
    // Add one to the index for the next slide number
    slideIndex++;
    // Add this Slide to our array
    slideArray.push(this);
}

var alphaLaunch = new Slide(
    "Lancement de l'Alpha privée",
    "Prochainement, un petit groupe d'Alpha testeurs vont pouvoir accéder à cette magnifique application développée par thebrainfox#4621",
    "https://www.slate.fr/sites/default/files/styles/1060x523/public/rocket-launch-67643_1920.jpg",
    "/article/private-alpha-app-launched/?from=webapp"
);

var p2p_update = new Slide(
    "reprise du développement du p2p",
    "Le développement de peer to peer (p2p) à repris avec les développeurs actifs MrNeutron et Thebrainfox#4621",
    "https://img-0.journaldunet.com/ckN-_4tZBoEQPlOYHb_e0HrpwRQ=/1500x/smart/78b7526b75d045c8a0da58780277ad9f/ccmcms-jdn/10829593.jpg",
    "/article/reprise-du-developpement-p2p/?from=webapp"
);

var LastMan = new Slide(
    "Vous avez vu un bug ?",
    "Allez directement le report à un membre de l'équipe Discoin. Vous serez amené à être recontacté et vous recevrez surement une récompense pour votre aide précieuse",
    "https://media.gettyimages.com/id/155384933/fr/photo/erreur-lors-de-la-fen%C3%AAtre.jpg?s=612x612&w=gi&k=20&c=ZUhewweRC5Q-BSBazNosMHTM69VmwIoiFwyplWB0Ic0=",
    "/article/found-a-bug/?from=webapp"
);

function buildSlider() {
    // A variable to hold all our HTML
    var myHTML;

    // Go through the Array and add the code to our HTML
    for (var i = 0; i < slideArray.length; i++) {

        myHTML += "<div id='" + slideArray[i].id +
            "' class='singleSlide' style='background-image:url(" + slideArray[i].background + ");'>" +
            "<div class='slideOverlay'>" +
            "<h1>" + slideArray[i].title + "</h1>" +
            "<h4>" + slideArray[i].subtitle + "</h4>" +
            "<a href='" + slideArray[i].link + `'>En savoir plus <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="white" d="M12 5l7 7-7 7V5z"/></svg></a>` +
            "</div>" +
            "</div>";

    }

    document.getElementById("mySlider").innerHTML = myHTML;

    document.getElementById("mySlider").innerHTML = myHTML;

    document.getElementById("slide" + currentSlideIndex).style.left = 0;
}

buildSlider();

function prevSlide() {
    // Figure out what the previous slide is
    var nextSlideIndex;
    // If we are at zero go to the last slide in the list
    if (currentSlideIndex === 0) {
        nextSlideIndex = slideArray.length - 1;
    } else {
        // Otherwise the next one is this slide minus 1
        nextSlideIndex = currentSlideIndex - 1;
    }

    // Setup the next slide and current slide for animations
    document.getElementById("slide" + nextSlideIndex).style.left = "-100%";
    document.getElementById("slide" + currentSlideIndex).style.left = 0;

    // Add the appropriate animation class to the slide
    document.getElementById("slide" + nextSlideIndex).setAttribute("class", "singleSlide slideInLeft");
    document.getElementById("slide" + currentSlideIndex).setAttribute("class", "singleSlide slideOutRight");

    // Set current slide to the new current slide
    currentSlideIndex = nextSlideIndex;
}

function nextSlide() {
    // Figure out what the next slide is
    var nextSlideIndex;
    // If we are at the last slide the next one is the first (zero based)
    if (currentSlideIndex === (slideArray.length - 1)) {
        nextSlideIndex = 0;
    } else {
        // Otherwise the next slide is the current one plus 1
        nextSlideIndex = currentSlideIndex + 1;
    }

    // Setup the next slide and current slide for animations
    document.getElementById("slide" + nextSlideIndex).style.left = "100%";
    document.getElementById("slide" + currentSlideIndex).style.left = 0;

    // Add the appropriate animation class to the slide
    document.getElementById("slide" + nextSlideIndex).setAttribute("class", "singleSlide slideInRight");
    document.getElementById("slide" + currentSlideIndex).setAttribute("class", "singleSlide slideOutLeft");

    // Set current slide to the new current slide
    currentSlideIndex = nextSlideIndex;
}