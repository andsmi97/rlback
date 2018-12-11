//TODO replace slider
/* Slider 1 - Parallax slider*/
$(window).load(function() {
  $(".flexslider").flexslider({
    easing: "easeInOutSine",
    directionNav: true,
    animationSpeed: 1000,
    slideshowSpeed: 2600
  });
});
//TODO replace prettyphoto
/* Image slideshow */
jQuery(".prettyphoto").prettyPhoto({
  overlay_gallery: false,
  social_tools: false
});

// Accordion
var acc = document.getElementsByClassName("showMore");

for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
    this.classList.toggle("active");

    /* Toggle between hiding and showing the active panel */
    var accordionGallery = this.nextElementSibling;
    if (accordionGallery.style.display === "block") {
      accordionGallery.style.display = "none";
    } else {
      accordionGallery.style.display = "block";
    }
  });
}

for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var accordionGallery = this.nextElementSibling;
    if (accordionGallery.style.maxHeight) {
      accordionGallery.style.maxHeight = null;
    } else {
      accordionGallery.style.maxHeight = accordionGallery.scrollHeight + "px";
    }
  });
}

//TODO: change jQuery
var topMenu = $("#navbarSticky");
var topMenuHeight = topMenu.outerHeight() + 65;
menuItems = topMenu.find("a");
// Anchors corresponding to menu items
var scrollItems = menuItems
  .filter(function() {
    return $(this)
      .attr("href")
      .match(/^(#[a-z\d-]+)$/g);
  })
  .map(function() {
    var item = $($(this).attr("href"));
    return item;
  });

// Bind to scroll
$(window).scroll(function() {
  navFunction();
  // Get container scroll position
  var fromTop = $(this).scrollTop() + topMenuHeight;

  // Get id of current scroll item
  var cur = scrollItems.map(function() {
    if ($(this).offset().top < fromTop + 300) return this;
  });

  // Get the id of the current element
  cur = cur[cur.length - 1];
  var id = cur && cur.length ? cur[0].id : "";
  // Set/remove active class
  menuItems
    .parent()
    .removeClass("active")
    .end()
    .filter("[href='#" + id + "']")
    .parent()
    .addClass("active");
});
//TODO: change jQuery
$(".nav").on("click", "a", function(event) {
  //отменяем стандартную обработку нажатия по ссылке
  if (
    $(this).attr("href") !== "/news" &&
    $(this).attr("href") !== "/projects"
  ) {
    event.preventDefault();
    var id = $(this).attr("href"),
      //узнаем высоту от начала страницы до блока на который ссылается якорь
      top = $(id).offset().top - 85;
    //анимируем переход на расстояние - top за 1500 мс
    $("body,html").animate(
      {
        scrollTop: top
      },
      1500
    );
  }
  //забираем идентификатор бока с атрибута href
});
// When the user scrolls the page, execute myFunction
window.onscroll = function() {
  navFunction();
};

var navbar = document.getElementById("navbarSticky");
var navNumber = document.getElementById("navPhone");
var sticky = navbar.offsetTop;
// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function navFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky");
    navNumber.classList.add("phoneHidden");
  } else {
    navbar.classList.remove("sticky");
    navNumber.classList.remove("phoneHidden");
  }
}

fetch("https://185.220.34.243/getcontacts")
  .then(function(response) {
    return response.json();
  })
  .then(function(settings) {
    return settings.map(function(contacts) {
      var phone = document.getElementsByClassName("navPhone");
      var mail = document.getElementsByClassName("navMail");
      for (var i = 0; i < phone.length; i++) {
        phone[i].innerHTML = contacts.phone;
        mail[i].innerHTML = contacts.MAIL.USER;
        mail[i].href = "mailto:" + contacts.MAIL.USER;
      }
    });
  });

//TODO: CHANGE jQuery
$(".primary-link").click(function() {
  $(".switchCopy").text(
    $(".switchCopy").text() == "Скрыть" ? "Показать больше" : "Скрыть"
  );
});

$(".navbar-toggle").click(function() {
  console.log("test");
  var nav = document.querySelector(".navbar-collapse");
  nav.classList.toggle("in");
});
