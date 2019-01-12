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

fetch('https://lesnayagavan.ru/getposts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    date: Date.now(),
  }),
})
  .then(response => response.json())
  .then(posts => posts.map((post) => {
    const div = createEle('div');
    const article = createEle('article');
    const h2 = createEle('h2');
    const img1 = createEle('img');
    article.innerHTML = post.body;
    h2.innerHTML = post.title;
    img1.setAttribute('alt', 'Проект дома лесная гавань');
    img1.setAttribute('src', post.image);
    append(div, h2);
    if (post.image) {
      append(div, img1);
    }
    append(div, article);
    append(document.getElementById('news'), div);
    div.classList.add('col-md-12');
  }));

fetch('https://lesnayagavan.ru/getcontacts')
  .then(response => response.json())
  // .then((response)=>console.log(response))
  .then(settings => settings.map((contacts) => {
    const phone = document.getElementsByClassName('navPhone');
    const phone2 = document.getElementsByClassName('navPhone2');
    const mail = document.getElementsByClassName('navMail');
    for (var i = 0; i < phone.length; i++) {
      phone[i].innerHTML = contacts.phone;
    }
    for (var i = 0; i < phone2.length; i++) {
      phone2[i].innerHTML = contacts.phone2;
    }
    for (var i = 0; i < mail.length; i++) {
      mail[i].innerHTML = contacts.MAIL.USER;
      mail[i].href = `mailto:${contacts.MAIL.USER}`;
    }
  }));
