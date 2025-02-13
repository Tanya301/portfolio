let data = [];
let commits = [];

async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
        ...row,
        line: Number(row.line), // or just +row.line
        depth: Number(row.depth),
        length: Number(row.length),
        date: new Date(row.date + 'T00:00' + row.timezone),
        datetime: new Date(row.datetime),
    }));

    commits = d3.groups(data, (d) => d.commit);

    // processCommits();
    // console.log(commits);
    displayStats();
}

function processCommits() {
    commits = d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
            id: commit,
            url: 'https://github.com/Tanya301/portfolio/commit/' + commit,
            author,
            date,
            time,
            timezone,
            datetime,
            hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
            totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
            value: lines,
            // What other options do we need to set?
            // Hint: look up configurable, writable, and enumerable
        });
  
        return ret;
    });
}

function displayStats() {
    // Process commits first
    processCommits();
  
    // Create the dl element
    const dl = d3.select('#stats').append('dl').attr('class', 'stats');
  
    // Add total LOC
    dl.append('dt').html('Total <abbr title="Lines of code">LOC</abbr>');
    dl.append('dd').text(data.length);
  
    // Add total commits
    dl.append('dt').text('Total commits');
    dl.append('dd').text(commits.length);
  
    // Additional data
    const fileLengths = d3.rollups(
        data,
        (v) => d3.max(v, (v) => v.line),
        (d) => d.file
    );
    
    // max file length
    const maxFileLength = d3.max(fileLengths, (d) => d[1]);
    dl.append('dt').text('Maximum file length (in lines)');
    dl.append('dd').text(maxFileLength);
    
    // avg file length
    const avgFileLength = d3.mean(fileLengths, (d) => d[1]);
    dl.append('dt').text('Average file length (in lines)');
    dl.append('dd').text(Math.round(avgFileLength));
    
    // day of week with most work
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const commitsByDay = d3.rollup(
        commits,
        v => v.length,
        d => d.datetime.getDay()
    );
    const mostActiveDay = Array.from(commitsByDay.entries())
        .reduce((a, b) => (b[1] > a[1] ? b : a));
    dl.append('dt').text('Most active day');
    dl.append('dd').text(dayNames[mostActiveDay[0]]);
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
});


const width = 1000;
const height = 600;

const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');