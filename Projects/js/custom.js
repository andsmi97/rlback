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

function createEle(element) {
  return document.createElement(element);
}

function append(parent, element) {
  return parent.appendChild(element);
}

fetch(`http://localhost:8080/getprojects`, {
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
  .then(function(projects) {
    return projects.map(function(project) {
      var div = createEle("div");
      var article = createEle("article");
      var h2 = createEle("h2");
      var img1 = createEle("img");
      var img2 = createEle("img");
      article.innerHTML = project.body;
      h2.innerHTML = project.title;
      img1.setAttribute("alt", "Проект дома лесная гавань");
      img1.setAttribute("src", project.image1);
      img2.setAttribute("alt", "Проект дома лесная гавань");
      img2.setAttribute("src", project.image2);
      append(div, h2);
      append(div, img1)
      append(div, img2)
      append(div, article);
      append(document.getElementById("projects"), div);
      div.classList.add("col-md-12");
    });
  });

fetch("https://localhost:8080/getcontacts")
  .then(function(response) {
    return response.json();
  })
  .then(function(settings) {
    return settings.map(function(contacts) {
      var phone = document.getElementsByClassName("navPhone");
      var phone2 = document.getElementsByClassName("navPhone2");
      var mail = document.getElementsByClassName("navMail");
      for (var i = 0; i < phone.length; i++) {
        phone[i].innerHTML = contacts.phone;
      }
      for (var i = 0; i < phone2.length; i++) {
        phone2[i].innerHTML = contacts.phone;
      }
      for (var i = 0; i < mail.length; i++){
        mail[i].innerHTML = contacts.MAIL.USER;
        mail[i].href = "mailto:" + contacts.MAIL.USER;
      }
    });
  });