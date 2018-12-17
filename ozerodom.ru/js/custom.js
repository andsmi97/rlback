function createEle(element) {
  return document.createElement(element);
}

function append(parent, element) {
  return parent.appendChild(element);
}

fetch(`http://localhost:8080/siteContent`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    site: "ozerodom.ru"
  })
})
  .then(function(response) {
    return response.json();
  })
  .then(function(photos) {
    // console.log(photos);
    //carousel
    var carousel = document.getElementById("carousel");
    var br = createEle("br");
    photos.carousel.map(function(photo) {
      var divCarousel = createEle("div");
      var carouselImg = createEle("IMG");
      carouselImg.setAttribute("width", "100%");
      carouselImg.setAttribute("height", "100%");
      carouselImg.setAttribute("alt", "Лесная гавань");
      carouselImg.setAttribute("src", photo);
      carousel.classList.add("autoplayphoto");
      append(divCarousel, carouselImg);
      append(carousel, divCarousel);
    });
    //advertising
    var advertising = document.getElementById("advertising");
    //1st photo
    var divAdvertising0 = createEle("div");
    var advertisinglImg0 = createEle("IMG");
    advertisinglImg0.setAttribute("alt", "Лесная гавань");
    advertisinglImg0.setAttribute("data-src", photos.advertising[0]);
    advertisinglImg0.classList.add(
      "img-responsive",
      "center-block",
      "img-thumbnail"
    );
    append(divAdvertising0, advertisinglImg0);
    append(divAdvertising0, br);
    append(advertising, divAdvertising0);
    //2nd photo
    var divAdvertising1 = createEle("div");
    var advertisinglImg1 = createEle("IMG");
    advertisinglImg1.setAttribute("alt", "Лесная гавань");
    advertisinglImg1.setAttribute("data-src", photos.advertising[1]);
    advertisinglImg1.classList.add(
      "img-responsive",
      "center-block",
      "img-thumbnail"
    );
    append(divAdvertising1, advertisinglImg1);
    append(advertising, divAdvertising1);
    //genplan
    var genplan = document.getElementById("genplan");
    photos.genPlan.map(function(photo) {
      var divGenplan = createEle("div");
      var genplanlImg = createEle("IMG");
      genplanlImg.style.maxHeight = "772px";
      genplanlImg.setAttribute("alt", "Лесная гавань");
      genplanlImg.setAttribute("data-src", photo);
      genplan.classList.add("img-responsive", "center-block", "img-thumbnail");
      append(divGenplan, genplanlImg);
      append(divAdvertising0, br);
      append(genplan, divGenplan);
    });
    //gallery
    var gallery = document.getElementById("gallery");
    //1st photo
    var divGallery0 = createEle("div");
    var galleryImg0 = createEle("IMG");
    var galleryAnch0 = createEle("a");
    divGallery0.classList.add("col-md-3");
    galleryImg0.style.height = "122px";
    galleryImg0.setAttribute("alt", "Лесная гавань");
    galleryImg0.setAttribute("data-src", photos.gallery[0]);
    galleryAnch0.classList.add("prettyphoto");
    galleryAnch0.setAttribute("rel", "prettyPhoto[pp_gal2]");
    galleryAnch0.setAttribute("href", photos.gallery[0]);
    galleryImg0.classList.add(
      "lazy",
      "img-responsive",
      "center-block",
      "img-thumbnail"
    );
    append(galleryAnch0, galleryImg0);
    append(divGallery0, galleryAnch0);
    append(divGallery0, br);
    append(gallery, divGallery0);
    //2nd photo
    var divGallery1 = createEle("div");
    var galleryImg1 = createEle("IMG");
    var galleryAnch1 = createEle("a");
    divGallery1.classList.add("col-md-3");
    galleryImg1.style.height = "122px";
    galleryImg1.setAttribute("alt", "Лесная гавань");
    galleryImg1.setAttribute("data-src", photos.gallery[1]);
    galleryAnch1.classList.add("prettyphoto");
    galleryAnch1.setAttribute("rel", "prettyPhoto[pp_gal2]");
    galleryAnch1.setAttribute("href", photos.gallery[1]);
    galleryImg1.classList.add(
      "lazy",
      "img-responsive",
      "center-block",
      "img-thumbnail"
    );
    append(galleryAnch1, galleryImg1);
    append(divGallery1, galleryAnch1);
    append(divGallery1, br);
    append(gallery, divGallery1);
    //3rd photo
    var divGallery2 = createEle("div");
    var galleryImg2 = createEle("IMG");
    var galleryAnch2 = createEle("a");
    divGallery2.classList.add("col-md-3");
    galleryImg2.style.height = "122px";
    galleryImg2.setAttribute("alt", "Лесная гавань");
    galleryImg2.setAttribute("data-src", photos.gallery[2]);
    galleryAnch2.classList.add("prettyphoto");
    galleryAnch2.setAttribute("rel", "prettyPhoto[pp_gal2]");
    galleryAnch2.setAttribute("href", photos.gallery[2]);
    galleryImg2.classList.add(
      "lazy",
      "img-responsive",
      "center-block",
      "img-thumbnail"
    );
    append(galleryAnch2, galleryImg2);
    append(divGallery2, galleryAnch2);
    append(divGallery2, br);
    append(gallery, divGallery2);
    //4th photo
    var divGallery3 = createEle("div");
    var galleryImg3 = createEle("IMG");
    var galleryAnch3 = createEle("a");
    divGallery3.classList.add("col-md-3");
    galleryImg3.style.height = "122px";
    galleryImg3.setAttribute("alt", "Лесная гавань");
    galleryImg3.setAttribute("data-src", photos.gallery[3]);
    galleryAnch3.classList.add("prettyphoto");
    galleryAnch3.setAttribute("rel", "prettyPhoto[pp_gal2]");
    galleryAnch3.setAttribute("href", photos.gallery[3]);
    galleryImg3.classList.add(
      "lazy",
      "img-responsive",
      "center-block",
      "img-thumbnail"
    );
    append(galleryAnch3, galleryImg3);
    append(divGallery3, galleryAnch3);
    append(divGallery3, br);
    append(gallery, divGallery3);
    //show more
    var gallerySM = document.getElementById("gallerySM");
    photos.gallery.map(function(photo) {
      var divGallerySM = createEle("div");
      var gallerySMImg = createEle("IMG");
      var gallerySMAnch = createEle("a");
      divGallerySM.classList.add("col-md-3");
      gallerySMImg.setAttribute("alt", "Лесная гавань");
      gallerySMImg.setAttribute("data-src", photo);
      gallerySMAnch.classList.add("prettyphoto");
      gallerySMAnch.setAttribute("rel", "prettyPhoto[pp_gal2]");
      gallerySMAnch.setAttribute("href", photo);
      gallerySMImg.classList.add(
        "lazy",
        "img-responsive",
        "center-block",
        "img-thumbnail"
      );
      append(gallerySMImg, gallerySMAnch);
      append(gallerySMAnch, divGallerySM);
      append(divGallerySM, br);
      append(gallerySM,divGallerySM);
    });
    //path
    var path = document.getElementById("path");
    //1st photo
    var divPath0 = createEle("div");
    var pathImg0 = createEle("IMG");
    divPath0.classList.add("col-md-4");
    pathImg0.setAttribute("alt", "Лесная гавань");
    pathImg0.setAttribute("data-src", photos.path[0]);
    pathImg0.classList.add(
      "lazy",
      "img-responsive",
      "center-block",
      "img-thumbnail"
    );
    append(divPath0, pathImg0);
    append(path, divPath0);
    //2nd photo
    var divPath1 = createEle("div");
    var pathImg1 = createEle("IMG");
    divPath1.classList.add("col-md-4");
    pathImg1.setAttribute("alt", "Лесная гавань");
    pathImg1.setAttribute("data-src", photos.path[1]);
    pathImg1.classList.add(
      "lazy",
      "img-responsive",
      "center-block",
      "img-thumbnail"
    );
    append(divPath1, pathImg1);
    append(path, divPath1);
    //3rd photo
    var divPath2 = createEle("div");
    var pathImg2 = createEle("IMG");
    divPath2.classList.add("col-md-4");
    pathImg2.setAttribute("alt", "Лесная гавань");
    pathImg2.setAttribute("data-src", photos.path[2]);
    pathImg2.classList.add(
      "lazy",
      "img-responsive",
      "center-block",
      "img-thumbnail"
    );
    append(divPath2, pathImg2);
    append(path, divPath2);
    console.log("fetched");
  })
  .then(function() {
    var lazyloadImages = document.querySelectorAll("img.lazy");
    var lazyloadThrottleTimeout;
    function lazyload() {
      if (lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
      }

      lazyloadThrottleTimeout = setTimeout(function() {
        var scrollTop = window.pageYOffset;
        lazyloadImages.forEach(function(img) {
          if (img.offsetTop < window.innerHeight + scrollTop) {
            img.src = img.dataset.src;
            img.classList.remove("lazy");
          }
        });
        if (lazyloadImages.length == 0) {
          document.removeEventListener("scroll", lazyload);
          window.removeEventListener("resize", lazyload);
          window.removeEventListener("orientationChange", lazyload);
        }
      }, 20);
    }
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

      lazyload();
    });
  });

//TODO replace slider
/* Slider 1 - Parallax slider*/
$(window).load(function() {
  // $(".flexslider").flexslider({
  //   easing: "easeInOutSine",
  //   directionNav: true,
  //   animationSpeed: 1000,
  //   slideshowSpeed: 2600
  // });

  $(".autoplay").slick({
    autoplay: true,
    fade: true,
    arrows: true,
    autoplaySpeed: 5000,
    speed: 1500,
    dots: true,
    slidesToShow: 1
  });
});
//TODO replace prettyphoto
/* Image slideshow */
// jQuery(".prettyphoto").prettyPhoto({
//   overlay_gallery: false,
//   social_tools: false
// });

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

//

// Bind to scroll

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
fetch("https://lesnayagavan.ru/getcontacts")
  .then(function(response) {
    return response.json();
  })
  .then(function(settings) {
    return settings.map(function(contacts) {
      var phone = document.getElementsByClassName("navPhone");
      var mail = document.getElementsByClassName("navMail");
      for (var i = 0; i < phone.length; i++) {
        phone[i].innerHTML = contacts.phone;
      }
      for (var i = 0; i < mail.length; i++) {
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

//
