console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// - - - Navigation - - - //
const ARE_WE_HOME = document.documentElement.classList.contains('home');

let pages = [
  { url: '', title: 'Home' },
  { url: 'contact/', title: 'Contact' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'https://github.com/Tanya301', title: 'Github 🔗' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  // Create link and add it to nav
  if (!ARE_WE_HOME && !url.startsWith('http')) {
    url = '../' + url;
  }
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  if (a.host !== location.host) {
    a.target = '_blank';
  }
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }
  nav.append(a);
}

// - - - Dark/Light theme - - - //
document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
      <option value="light dark">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
		</select>
	</label>`
);
const select = document.querySelector('.color-scheme select');

if ("colorScheme" in localStorage) {
  select.value = localStorage.colorScheme;
  setColorScheme(localStorage.colorScheme)
}

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  localStorage.colorScheme = event.target.value
  setColorScheme(localStorage.colorScheme)
});

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
}

// - - - Contact form - - - //
const form = document.getElementById('contact-form');

form?.addEventListener('submit', function (event) {
  event.preventDefault();
  const data = new FormData(form);
  let url = form.action + "?";
  for (let [name, value] of data) {
    if (url.slice(-1) !== "?") {
      url += "&";
    }
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
  }
  location.href = url;
});