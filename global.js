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
    { url: 'meta/', title: 'Meta' },
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

// - - - Projects - - - //
export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        const data = await response.json();
        return data

    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h1') {
    projects.sort((a, b) => b.year - a.year);
    containerElement.innerHTML = '';
    for (let project of projects) {
        const article = document.createElement('article');
        
        const heading = document.createElement(headingLevel);
        heading.textContent = project.title;

        const year = document.createElement('dt')
        year.textContent = project.year

        // const img = document.createElement('img');
        // img.src = project.image;
        // img.alt = project.title;

        const paragraph = document.createElement('p');
        paragraph.textContent = project.description;

        article.appendChild(heading);
        article.appendChild(year)
        // article.appendChild(img);
        article.appendChild(paragraph);

        containerElement.appendChild(article);
    }
}

// - - - GitHub - - - //
export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}