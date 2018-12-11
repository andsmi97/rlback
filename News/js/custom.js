
// Bind to scroll
$(window).scroll(function() {
  navFunction();
});


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

fetch(`http://lesnayagavan.ru/getposts`, {
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

fetch("http://lesnayagavan.ru/getcontacts")
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