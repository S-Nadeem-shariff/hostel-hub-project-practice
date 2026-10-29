// 

import { useState, useEffect } from 'react';

function App() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form input states
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [pricePerMonth, setPricePerMonth] = useState('');

  // Fetch rooms on load
  const fetchRooms = () => {
    fetch('http://localhost:5000/api/rooms')
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching rooms:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle form submission to create a room
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomNumber, capacity, pricePerMonth })
      });

      if (response.ok) {
        // Clear form inputs
        setRoomNumber('');
        setCapacity('');
        setPricePerMonth('');
        // Refresh the room list
        fetchRooms();
      } else {
        alert('Failed to add room');
      }
    } catch (err) {
      console.error('Error adding room:', err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1>Hostel Hub Project</h1>

      {/* Add Room Form */}
      <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3>Add New Room</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label>Room Number: </label><br />
          <input 
            type="text" 
            value={roomNumber} 
            onChange={(e) => setRoomNumber(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Capacity (Persons): </label><br />
          <input 
            type="number" 
            value={capacity} 
            onChange={(e) => setCapacity(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Price Per Month (₹): </label><br />
          <input 
            type="number" 
            value={pricePerMonth} 
            onChange={(e) => setPricePerMonth(e.target.value)} 
            required 
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
          />
        </div>
        <button type="submit" style={{ background: '#007bff', color: 'white', padding: '0.7rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Room
        </button>
      </form>

      {/* Display Rooms */}
      <h2>Available Rooms</h2>
      {loading ? (
        <p>Loading...</p>
      ) : rooms.length === 0 ? (
        <p>No rooms found in the database yet.</p>
      ) : (
        <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
          {rooms.map((room) => (
            <li key={room._id} style={{ background: '#e9ecef', padding: '1rem', marginBottom: '0.5rem', borderRadius: '4px' }}>
              <strong>Room {room.roomNumber}</strong> — Capacity: {room.capacity} | ₹{room.pricePerMonth}/month
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;