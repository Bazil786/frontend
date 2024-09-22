import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [filters, setFilters] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!Array.isArray(parsedData.data)) throw new Error('Invalid JSON format');

      // Use your deployed backend API
      const response = await axios.post('https://rest-api-production-16d2.up.railway.app/bfhl', { data: parsedData.data });
      setResponseData(response.data);
      setError('');
    } catch (err) {
      setError('Invalid JSON input');
    }
  };

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    setFilters(prev => checked ? [...prev, value] : prev.filter(f => f !== value));
  };

  const renderFilteredData = () => {
    if (!responseData) return null;

    let filteredResponse = {};
    if (filters.includes('Alphabets')) filteredResponse.alphabets = responseData.alphabets;
    if (filters.includes('Numbers')) filteredResponse.numbers = responseData.numbers;
    if (filters.includes('Highest Lowercase Alphabet')) filteredResponse.highest_lowercase = responseData.highest_lowercase;

    return (
      <div>
        <h3>Filtered Response:</h3>
        {Object.entries(filteredResponse).map(([key, value]) => (
          <p key={key}>{key}: {Array.isArray(value) ? value.join(', ') : value}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>API Input</h1>
      <textarea 
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        rows="4"
        cols="50"
        placeholder='Enter JSON e.g. {"data": ["A", "1", "C", "z"]}'
      />
      <br/>
      <button onClick={handleSubmit}>Submit</button>
      {error && <p style={{color: 'red'}}>{error}</p>}

      {responseData && (
        <>
          <div>
            <h3>Multi Filter</h3>
            <label>
              <input type="checkbox" value="Alphabets" onChange={handleFilterChange} />
              Alphabets
            </label>
            <label>
              <input type="checkbox" value="Numbers" onChange={handleFilterChange} />
              Numbers
            </label>
            <label>
              <input type="checkbox" value="Highest Lowercase Alphabet" onChange={handleFilterChange} />
              Highest Lowercase Alphabet
            </label>
          </div>

          {renderFilteredData()}
        </>
      )}
    </div>
  );
}

export default App;
