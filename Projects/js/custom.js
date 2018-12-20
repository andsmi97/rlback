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
    site: "ozerodom.ru"
  })
})
  .then(function(response) {
    return response.json();
  })
  .then(function(photos) {
    var projects = document.getElementById("projects");
    var br = createEle("br");
    photos.projects.map(function(photo) {
      var divProjects = createEle("div");
      var projectsImg = createEle("IMG");
      var article = createEle("article");
      var h2 = createEle("h2");
      article.innerHTML = project.body;
      h2.innerHTML = project.title;
      projectsImg.setAttribute("width", "100%");
      projectsImg.setAttribute("height", "100%");
      projectsImg.setAttribute("alt", "Лесная гавань");
      projectsImg.setAttribute("src", photo);
      // projects.classList.add("autoplayphoto");
      append(divProjects, h2);
      append(divProjects, article);
      append(divProjects, projectsImg);
      append(divProjects, br);
      append(projects, divProjects);
    });
  });

// fetch(`http://185.220.34.243/getprojects`, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     date: Date.now()
//   })
// })
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(projects) {
//     return projects.map(function(project) {
//       var div = createPost("div");
//       var article = createPost("article");
//       var h2 = createPost("h2");
//       article.innerHTML = project.body;
//       h2.innerHTML = project.title;
//       append(div, h2);
//       append(div, article);
//       append(document.getElementById("news"), div);
//       div.classList.add("col-md-12");
//     });
//   });

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
