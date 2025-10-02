import { useState } from 'react';
import './App.css';
import { defaultConfig } from './mock';
import type { ImageItem } from './types';

function App() {
  // The source of truth you'll use in the app:
  const [config, setConfig] = useState<ImageItem[]>(defaultConfig);

  // UI text shown in the textarea:
  const [text, setText] = useState<string>(() =>
    JSON.stringify(defaultConfig, null, 2)
  );

  // Validation state:
  const [error, setError] = useState<string | null>(null);

  // When user edits the textarea:
  const onChange = (value: string) => {
    setText(value);
    try {
      const parsed = JSON.parse(value) as ImageItem[];

      setConfig(parsed); // ✅ keep object in sync
      setError(null);
    } catch (e: any) {
      setError(e.message); // ❌ don't update object on invalid JSON
    }
  };

  // Shotstack integration state
  const [loading, setLoading] = useState(false);
  const [renderStatus, setRenderStatus] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Submit handler - send to Shotstack API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting render with config:', config);

    setLoading(true);
    setError(null);
    setVideoUrl('');
    setRenderStatus('Preparing render...');

    try {
      const { createRender, pollRenderStatus } = await import(
        './services/shotstack'
      );
      const { transformToShotstackPayload } = await import(
        './utils/transformer'
      );

      // Transform simple config to Shotstack format
      const shotstackPayload = transformToShotstackPayload(config);
      console.log('Transformed payload:', shotstackPayload);

      // Create render with the transformed payload
      setRenderStatus('Creating render...');
      const renderId = await createRender(shotstackPayload);

      // Poll for completion
      setRenderStatus('Rendering...');
      const url = await pollRenderStatus(renderId, (currentStatus) => {
        setRenderStatus(`Status: ${currentStatus}`);
      });

      setVideoUrl(url);
      setRenderStatus('Render complete!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRenderStatus('');
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
          />
        </div>
        {error && (
          <div style={{ marginBottom: '1rem', color: 'red' }}>
            Error: {error}
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {renderStatus && (
        <div style={{ marginTop: '1rem', color: '#666' }}>{renderStatus}</div>
      )}

      {videoUrl && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Result:</h2>
          <video controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </>
  );
}

export default App;
