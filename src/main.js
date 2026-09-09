const root = document.getElementById('root');

fetch('./legacy-body.html')
  .then((response) => {
    if (!response.ok) throw new Error(`Portfolio content request failed (${response.status})`);
    return response.text();
  })
  .then((content) => {
    root.innerHTML = content;
    const script = document.createElement('script');
    script.src = './script.js';
    document.body.appendChild(script);
  })
  .catch((error) => {
    root.innerHTML = `<p class="react-migration-error" role="alert">Portfolio content could not load: ${error.message}</p>`;
  });
