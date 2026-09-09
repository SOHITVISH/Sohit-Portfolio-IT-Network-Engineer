import { useEffect, useState } from 'react';
import '../style.css';

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
    <LegacyPortfolio />
  );
}
