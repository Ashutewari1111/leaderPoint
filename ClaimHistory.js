import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function ClaimHistory({ refreshTrigger }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/users/history`)
      .then(res => setHistory(res.data))
      .catch(err => console.error('Failed to fetch history:', err));
  }, [refreshTrigger]); // Re-run this whenever refreshTrigger changes

  return (
    <div>
      <h2>Claim History</h2>
      {history.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Points Claimed</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {history.map(entry => (
              <tr key={entry._id}>
                <td>{entry.userId?.name}</td>
                <td>{entry.pointsClaimed}</td>
                <td>{new Date(entry.claimedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No claim history available yet.</p>
      )}
    </div>
  );
}


export default ClaimHistory;
