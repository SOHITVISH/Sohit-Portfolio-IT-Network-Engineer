import { useEffect, useState } from 'react';
import '../style.css';
import './react-migration.css';

const migrationCards = [
  ['COMPONENTS', 'Interactive sections are being moved into reusable React boundaries.'],
  ['STATE', 'Simulator state is ready to move from DOM listeners into hooks and stores.'],
  ['DELIVERY', 'Vite builds a production bundle while the existing visual system stays intact.']
];

function MigrationStatus() {
  return (
    <section className="react-migration-status section-shell" aria-label="React migration status">
      <div>
        <span className="section-number">REACT / FOUNDATION</span>
        <h2>Modern stack.<br /><em>Same identity.</em></h2>
        <p>React and Vite now power the portfolio shell, while the proven network-operations experience remains available during the staged component migration.</p>
      </div>
      <div className="react-migration-grid">
        {migrationCards.map(([label, copy]) => (
          <article key={label}>
            <span className="mono">{label}</span>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function LegacyPortfolio() {
  const [markup, setMarkup] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('./legacy-body.html')
      .then((response) => {
        if (!response.ok) throw new Error(`Portfolio content request failed (${response.status})`);
        return response.text();
      })
      .then((content) => {
        if (active) setMarkup(content);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!markup) return undefined;
    const script = document.createElement('script');
    script.src = './script.js';
    script.async = false;
    document.body.appendChild(script);
    return () => script.remove();
  }, [markup]);

  if (error) {
    return <p className="react-migration-error" role="alert">Portfolio content could not load: {error}</p>;
  }
  return <div dangerouslySetInnerHTML={{ __html: markup }} />;
}

export default function App() {
  return (
    <>
      <MigrationStatus />
      <LegacyPortfolio />
    </>
  );
}
