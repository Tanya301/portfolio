import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

const titleElement = document.querySelector('.projects-title'); // Select the title element

if (titleElement) {
    titleElement.textContent = `${projects.length} Projects`;
}

renderProjects(projects, projectsContainer, 'h2');

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let selectedIndex = -1;
let selectedYear = null;
let query = '';
let searchInput = document.querySelector('.searchBar');
let colors = d3.scaleOrdinal(d3.schemeSet3);
let sliceGenerator = d3.pie().value((d) => d.value);

function renderPieChart(projectsGiven) {
    let newRolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year,
    );
    let newData = newRolledData.map(([year, count]) => {
      return { value: count, label: year };
    });
    let arcData = sliceGenerator(newData);
    let arcs = arcData.map((d) => arcGenerator(d));
    
    let newSVG = d3.select('svg'); 
    newSVG.selectAll('path').remove();
    let legend = d3.select('.legend');
    legend.selectAll('li').remove()

    newData.forEach((d, idx) => {
        legend.append('li')
            .attr('style', `--color:${colors(idx)}`) // Define the CSS variable on <li>
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
            .attr('class', 'legend');
    });

    arcs.forEach((arc, i) => {
        newSVG
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(i))
        .on('click', () => {
            selectedIndex = selectedIndex === i ? -1 : i;
            
            newSVG
            .selectAll('path')
            .attr('class', (_, idx) => (
                idx === selectedIndex ? 'selected' : ''
            ));
            legend
            .selectAll('li')
            .attr('class', (_, idx) => (
                idx === selectedIndex ? 'selected' : ''
            ));
            let filteredProjects = projectsGiven;
            if (selectedIndex === -1) {
                if (query) {
                    filteredProjects = projectsGiven.filter((project) => {
                        let values = Object.values(project).join('\n').toLowerCase();
                            return values.includes(query.toLowerCase());
                    });
                } else {
                    renderProjects(projects, projectsContainer, 'h2');
                    return;
                }
            } else {
                selectedYear = newData[selectedIndex].label;
                filteredProjects = projectsGiven.filter(p => p.year === selectedYear);
                if (query) {
                    filteredProjects = filteredProjects.filter((project) => {
                        let values = Object.values(project).join('\n').toLowerCase();
                            return values.includes(query.toLowerCase());
                    });
                }
            }
            renderProjects(filteredProjects, projectsContainer, 'h2');
        });
    });

    searchInput.addEventListener('change', (event) => {
        query = event.target.value;
        let filteredProjects = projects.filter((project) => {
            let values = Object.values(project).join('\n').toLowerCase();
                return values.includes(query.toLowerCase());
        });

        if (selectedIndex !== -1) {
            if (query) {
                // year and search query
                filteredProjects = projects.filter(project => {
                    let values = Object.values(project).join('\n').toLowerCase();
                    return project.year === selectedYear && values.includes(query.toLowerCase());
                });
            } else {
                // no search query, only year
                filteredProjects = projects.filter(project => project.year === selectedYear);
            }
        } else {
            if (query) {
                // no year, but search query
                filteredProjects = projects.filter(project => {
                    let values = Object.values(project).join('\n').toLowerCase();
                    return values.includes(query.toLowerCase());
                });
            } else {
                // no filters
                filteredProjects = projects;
            }
        }

        // render filtered projects
        if (query) {
            renderPieChart(filteredProjects);
        } else {
            renderPieChart(projects);
        }
        renderProjects(filteredProjects, projectsContainer, 'h2');

        // reapply the color
        d3.selectAll('.legend li')
        .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));
        d3.selectAll('svg path')
        .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));
    });
}

renderPieChart(projects);


