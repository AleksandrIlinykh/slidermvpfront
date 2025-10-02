import { useState } from 'react'
import './App.css'

function App() {
  const [textValue, setTextValue] = useState('Default text value')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted with value:', textValue)
    // Add your form handling logic here
  }

  return (
    <>
      <h1>Slider MVP</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            rows={5}
            cols={50}
            style={{ width: '100%', maxWidth: '500px', padding: '0.5rem' }}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default App
