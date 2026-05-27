let appData = null;

const $ = (selector) => document.querySelector(selector);

function textIncludes(record, query) {
  return JSON.stringify(record).toLowerCase().includes(query.toLowerCase());
}

function renderVideos(videos) {
  const el = $('#videoCards');
  el.innerHTML = videos.map(video => `
    <article class="card">
      <h3>${video.title}</h3>
      <p>${video.summary}</p>
      <ul>${video.keyFindings.map(item => `<li>${item}</li>`).join('')}</ul>
      <a href="${video.sourceUrl}" target="_blank" rel="noopener">Open video source</a>
    </article>
  `).join('');
}

function renderConcepts(concepts) {
  const el = $('#conceptCards');
  el.innerHTML = concepts.map(item => `
    <article class="card">
      <h3>${item.concept}</h3>
      <p>${item.definition}</p>
      <p><strong>Governance indicator:</strong> ${item.governanceIndicator}</p>
    </article>
  `).join('');
}

function renderTable(selector, rows, columns) {
  const el = $(selector);
  const header = columns.map(col => `<th>${col.label}</th>`).join('');
  const body = rows.map(row => `
    <tr>${columns.map(col => `<td>${formatCell(row[col.key])}</td>`).join('')}</tr>
  `).join('');
  el.innerHTML = `<table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`;
}

function formatCell(value) {
  if (Array.isArray(value)) return value.join(', ');
  return value || '';
}

function render(data, query = '') {
  const q = query.trim();
  const videos = q ? data.videos.filter(item => textIncludes(item, q)) : data.videos;
  const people = q ? data.people.filter(item => textIncludes(item, q)) : data.people;
  const institutions = q ? data.institutions.filter(item => textIncludes(item, q)) : data.institutions;
  const concepts = q ? data.concepts.filter(item => textIncludes(item, q)) : data.concepts;

  $('#sourceNote').textContent = data.sourceNote;
  $('#videoCount').textContent = data.videos.length;
  $('#peopleCount').textContent = data.people.length;
  $('#institutionCount').textContent = data.institutions.length;
  $('#conceptCount').textContent = data.concepts.length;

  renderVideos(videos);
  renderConcepts(concepts);
  renderTable('#peopleTable', people, [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'notes', label: 'Research note' },
    { key: 'confidence', label: 'Confidence' }
  ]);
  renderTable('#institutionTable', institutions, [
    { key: 'name', label: 'Institution' },
    { key: 'type', label: 'Type' },
    { key: 'relevance', label: 'Relevance' },
    { key: 'concepts', label: 'Concepts' }
  ]);

  $('#promptBox').value = `${data.llmPrompt}\n\nCurrent structured context:\n${JSON.stringify({ videos, people, institutions, concepts }, null, 2)}`;
}

async function init() {
  const response = await fetch('data/cmc-data.json');
  appData = await response.json();
  render(appData);

  $('#searchInput').addEventListener('input', event => render(appData, event.target.value));

  $('#copyPrompt').addEventListener('click', async () => {
    await navigator.clipboard.writeText($('#promptBox').value);
    $('#copyPrompt').textContent = 'Copied';
    setTimeout(() => $('#copyPrompt').textContent = 'Copy prompt', 1200);
  });

  $('#runModel').addEventListener('click', runLocalModel);
}

async function runLocalModel() {
  const output = $('#llmOutput');
  output.textContent = 'Running local model call...';

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: $('#promptBox').value })
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    output.textContent = data.output || JSON.stringify(data, null, 2);
  } catch (error) {
    output.textContent = `Local LLM backend not available.\n\nRun npm install, copy .env.example to .env, add your API key, then run npm start.\n\nDetails: ${error.message}`;
  }
}

init().catch(error => {
  document.body.innerHTML = `<main class="panel"><h1>App failed to load</h1><p>${error.message}</p></main>`;
});
