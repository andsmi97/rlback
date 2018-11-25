/* Projects carousel */

// $(".carousel").carousel();

/* Slider 1 - Parallax slider*/
$(window).load(function() {
  $(".flexslider").flexslider({
    easing: "easeInOutSine",
    directionNav: true,
    animationSpeed: 1000,
    slideshowSpeed: 2600
  });
});
/* Image slideshow */

$("#s1").cycle({
  fx: "fade",
  speed: 2000,
  timeout: 300,
  pause: 1
});

/* Support */

$("#slist a").click(function(e) {
  e.preventDefault();
  $(this)
    .next("p")
    .toggle(200);
});
// $(function() {
//   $("#da-slider").cslider({
//     autoplay: true,
//     interval: 9000
//   });
// });
/* prettyPhoto Gallery */

jQuery(".prettyphoto").prettyPhoto({
  overlay_gallery: false,
  social_tools: false
});

/* Isotope */

// cache container
var $container = $("#portfolio");
// initialize isotope
$container.isotope({
  // options...
});

// filter items when filter link is clicked
$("#filters a").click(function() {
  var selector = $(this).attr("data-filter");
  $container.isotope({ filter: selector });
  return false;
});

/* Flex slider */

/* Image block effects */

$(function() {
  $("ul.hover-block li").hover(
    function() {
      $(this)
        .find(".hover-content")
        .animate({ top: "-3px" }, { queue: false, duration: 500 });
    },
    function() {
      $(this)
        .find(".hover-content")
        .animate({ top: "155px" }, { queue: false, duration: 500 });
    }
  );
});

/* Slide up & Down */

$(".dis-nav a").click(function(e) {
  e.preventDefault();
  var myClass = $(this).attr("id");
  $(".dis-content ." + myClass).toggle("slow");
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

// Cache selectors
// var topMenu = $("#navbarSticky"),
//   topMenuHeight = topMenu.outerHeight() + 65,
//   // All list items
//   menuItems = topMenu.find("a"),
//   // Anchors corresponding to menu items
//   scrollItems = menuItems.map(function() {
//     var item = $($(this).attr("href"));
//     if (item.length) {
//       return item;
//     }
//   });

var topMenu = $("#navbarSticky");
var topMenuHeight = topMenu.outerHeight() + 65;
(menuItems = topMenu.find("a")),
  // Anchors corresponding to menu items
  console.log(menuItems);
// console.log(
var scrollItems = menuItems
  .filter(function() {
    return $(this)
      .attr("href")
      .match(/^(#[a-z\d-]+)$/g);
  })
  .map(function() {
    var item = $($(this).attr("href"));
    console.log(item);
    return item;
  });

// console.log(
//   menuItems.map(function() {
//     var item = $($(this).attr("href"));
//     console.log(item);
//     if (item.length) {
//       return item;
//     }
//   })
// );
// scrollItems = menuItems.map(function() {
//   var item = $($(this).attr("href"));
//   console.log(item);
//   if (item.length) {
//     return item;
//   }
// });
// Bind to scroll
$(window).scroll(function() {
  navFunction();
  // Get container scroll position
  var fromTop = $(this).scrollTop() + topMenuHeight;

  // Get id of current scroll item
  var cur = scrollItems.map(function() {
    if ($(this).offset().top < fromTop +300) return this;
  });
  console.log(cur);
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

$(".nav").on("click", "a", function(event) {
  //отменяем стандартную обработку нажатия по ссылке
  if ($(this).attr("href") !== "/news") {
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

// // When the user scrolls the page, execute myFunction
window.onscroll = function() {
  navFunction();
};

var navbar = document.getElementById("navbarSticky");

var navNumber = document.getElementById("navPhone");

// Get the offset position of the navbar
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
