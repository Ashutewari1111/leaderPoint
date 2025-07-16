import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ClaimHistory from './ClaimHistory';


const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [claimedPoints, setClaimedPoints] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [newUserName, setNewUserName] = useState("");
  const [message, setMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const usersRes = await axios.get(`${API_BASE_URL}/users`);
      setUsers(usersRes.data);
      setLeaderboard(usersRes.data);
      if (!selectedUserId && usersRes.data.length > 0) {
        setSelectedUserId(usersRes.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error fetching data.');
    }
  };

  const handleClaimPoints = async () => {
    if (!selectedUserId) {
      setMessage('Please select a user first.');
      return;
    }
    try {
      setMessage("");
      const res = await axios.post(`${API_BASE_URL}/users/claim`, {
        userId: selectedUserId
      });
      setClaimedPoints(res.data.pointsClaimed);
      setLeaderboard(res.data.leaderboard);
      setMessage(`${res.data.user.name} claimed ${res.data.pointsClaimed} points!`);
       setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error claiming points:', error);
      setMessage('Error claiming points. Please try again.');
    }
  };

  const handleAddUser = async () => {
    if (!newUserName.trim()) {
      setMessage('User name cannot be empty.');
      return;
    }
    try {
      setMessage("");
      const res = await axios.post(`${API_BASE_URL}/users/add`, {
        name: newUserName.trim()
      });
      setMessage(res.data.message);
      setNewUserName("");
      fetchData();
} catch (error) {
      console.error('Error adding user:', error);
      setMessage(error.response?.data?.message || 'Error adding user.');
    }
  };

  return (
    <div>
    <div className="App">
      <h1>Leaderboard</h1>

      <div className="user-selection">
        <label htmlFor="user-select">Select User:</label>
        <select
          id="user-select"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        <button onClick={handleClaimPoints}>Claim Points</button>
        {claimedPoints && (
          <p className="claimed-message">You claimed: {claimedPoints} points!</p>
        )}
        {message && <p className="status-message">{message}</p>}
      </div>

      <div className="add-user-section">
        <h2>Add New User</h2>
        <input
          type="text"
          placeholder="New user name"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      <div className="leaderboard-section">
        <h2>Leaderboard Rankings</h2>
        {leaderboard.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user) => (
                <tr key={user._id}>
                  <td>{user.rank}</td>
                  <td>{user.name}</td>
                  <td>{user.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        
        ) : ( <p>No users to display on the leaderboard yet. Please adding someOne</p> )} 
      </div>
      <div className="claim-history-section">
  <ClaimHistory refreshTrigger={refreshTrigger} />
</div>

    </div>
</div>
  
  );
  
}

export default App;
