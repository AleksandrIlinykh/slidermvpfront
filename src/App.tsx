import { useEffect, useState } from 'react';
import './App.css';
import { defaultConfig } from './mock';
type ImageItem = { title: string; url: string };

function App() {
  // The source of truth you’ll use in the app:
  const [config, setConfig] = useState<ImageItem[]>(defaultConfig);

  // UI text shown in the textarea:
  const [text, setText] = useState<string>(() =>
    JSON.stringify(defaultConfig, null, 2)
  );

  // Validation state:
  const [error, setError] = useState<string | null>(null);

  // Example: load default from a file (optional)
  useEffect(() => {
    // replace with your URL or remove this effect if you hardcode defaults
    fetch('/images.json')
      .then((r) => r.json())
      .then((obj: ImageItem[]) => {
        setConfig(obj);
        setText(JSON.stringify(obj, null, 2));
        setError(null);
      })
      .catch(() => {}); // ignore if file not found
  }, []);

  // When user edits the textarea:
  const onChange = (value: string) => {
    setText(value);
    try {
      const parsed = JSON.parse(value) as ImageItem[];

      // (optional) tiny runtime checks
      if (!Array.isArray(parsed)) throw new Error('`images` must be an array');

      setConfig(parsed); // ✅ keep object in sync
      setError(null);
    } catch (e: any) {
      setError(e.message); // ❌ don’t update object on invalid JSON
    }
  };

  // Example: use the object (submit/save)
  const handleSubmit = () => {
    // here you have the validated object in `config`
    console.log('Saving object:', config);
    // e.g. POST to your API
  };

  return (
    <>
      <h1>Slider MVP</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <textarea
            value={text}
            onChange={(e) => onChange(e.target.value)}
            rows={30}
            cols={400}
            style={{ width: '100%', maxWidth: '1000px', padding: '0.5rem' }}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App;
