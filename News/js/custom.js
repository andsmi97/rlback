// Accordion

// var acc = document.getElementsByClassName("showMore");

// for (var i = 0; i < acc.length; i++) {
//   acc[i].addEventListener("click", function() {
//     /* Toggle between adding and removing the "active" class,
//         to highlight the button that controls the panel */
//     this.classList.toggle("active");

//     /* Toggle between hiding and showing the active panel */
//     var accordionGallery = this.nextElementSibling;
//     if (accordionGallery.style.display === "block") {
//       accordionGallery.style.display = "none";
//     } else {
//       accordionGallery.style.display = "block";
//     }
//   });
// }

// for (var i = 0; i < acc.length; i++) {
//   acc[i].addEventListener("click", function() {
//     this.classList.toggle("active");
//     var accordionGallery = this.nextElementSibling;
//     if (accordionGallery.style.maxHeight) {
//       accordionGallery.style.maxHeight = null;
//     } else {
//       accordionGallery.style.maxHeight = accordionGallery.scrollHeight + "px";
//     }
//   });
// }

// $(".primary-link").click(function() {
//   $(".switchCopy").text(
//     $(".switchCopy").text() == "Скрыть" ? "Показать больше" : "Скрыть"
//   );
// });

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

// Bind to scroll
$(window).scroll(function() {
  navFunction();
  // Get container scroll position
  // var fromTop = $(this).scrollTop() + topMenuHeight;

  // // Get id of current scroll item
  // var cur = scrollItems.map(function() {
  //   if ($(this).offset().top < fromTop) return this;
  // });
  // // Get the id of the current element
  // cur = cur[cur.length - 1];
  // var id = cur && cur.length ? cur[0].id : "";
  // // Set/remove active class
  // menuItems
  //   .parent()
  //   .removeClass("active")
  //   .end()
  //   .filter("[href='#" + id + "']")
  //   .parent()
  //   .addClass("active");
  // var contacts = document.getElementById("contacts");

  // if (cur === document.body.scrollHeight) {
  //   contacts.classList.add("active");
  // } else {
  //   contacts.classList.removeClass("active");
  // }
});

// $(".nav").on("click", "a", function(event) {
//   //отменяем стандартную обработку нажатия по ссылке
//   event.preventDefault();
//   //забираем идентификатор бока с атрибута href
//   var id = $(this).attr("href"),
//     //узнаем высоту от начала страницы до блока на который ссылается якорь
//     top = $(id).offset().top - 85;
//   //анимируем переход на расстояние - top за 1500 мс
//   $("body,html").animate(
//     {
//       scrollTop: top
//     },
//     1500
//   );
// });

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

function createPost(element) {
  return document.createElement(element);
}

function append(parent, element) {
  return parent.appendChild(element);
}

fetch(`http://185.220.34.243:8080/getposts`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    date: Date.now()
  })
})
  .then(function(response) {
    return response.json();
  })
  .then(function(posts) {
    return posts.map(function(post) {
      var div = createPost("div");
      var article = createPost("article");
      var h2 = createPost("h2");
      article.innerHTML = post.body;
      h2.innerHTML = post.title;
      append(div, h2);
      append(div, article);
      append(document.getElementById("news"), div);
      div.classList.add("col-md-12");
    });
  });
