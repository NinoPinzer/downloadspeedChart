import React, { useState } from 'react';
import axios from 'axios';

const Settings = () => {
  const [limit, setLimit] = useState('');

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // API-Aufruf zum Speichern des Limits
    axios.post('http://localhost:3001/api/save-limit', { limit })
      .then(response => {
        alert('Limit gespeichert');
      })
      .catch(error => {
        console.error('Es gab ein Problem beim Speichern des Limits', error);
      });
  };

  return (
    <div>
      <h1>Einstellungen</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Bandbreitenlimit (Mbps):
          <input type="number" value={limit} onChange={handleLimitChange} />
        </label>
        <button type="submit">Speichern</button>
      </form>
    </div>
  );
}

export default Settings;
