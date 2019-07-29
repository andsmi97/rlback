// Bind to scroll
$(window).scroll(() => {
  navFunction();
});

const navbar = document.getElementById('navbarSticky');

const navNumber = document.getElementById('navPhone');

// Get the offset position of the navbar
const sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function navFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add('sticky');
    navNumber.classList.add('phoneHidden');
  } else {
    navbar.classList.remove('sticky');
    navNumber.classList.remove('phoneHidden');
  }
}

function createEle(element) {
  return document.createElement(element);
}

function append(parent, element) {
  return parent.appendChild(element);
}

fetch('https://lesnayagavan.ru/api/articles?type=Post&limit=50&skip=0')
  .then(response => response.json())
  .then(posts =>
    posts.map(post => {
      const div = createEle('div');
      const article = createEle('article');
      article.innerHTML = post.body;
      append(div, article);
      append(document.getElementById('news'), div);
      div.classList.add('col-md-12');
    })
  );

fetch('http://lesnayagavan.ru/api/users/contacts')
  .then(response => response.json())
  .then(settings => {
    const phone = document.getElementsByClassName('navPhone');
    const phone2 = document.getElementsByClassName('navPhone2');
    const mail = document.getElementsByClassName('navMail');
    for (var i = 0; i < phone.length; i++) {
      phone[i].innerHTML = settings.phone;
    }
    for (var i = 0; i < phone2.length; i++) {
      phone2[i].innerHTML = settings.phone2;
    }
    for (var i = 0; i < mail.length; i++) {
      mail[i].innerHTML = settings.MAIL.USER;
      mail[i].href = `mailto:${settings.MAIL.USER}`;
    }
  });
