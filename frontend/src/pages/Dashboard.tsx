import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [history, setHistory] = useState<any | null>(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [seats, setSeats] = useState<number>(1);

  const fetchHistory = async () => {
    const res = await axios.get('http://localhost:5000/api/rides/history', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setHistory(res.data);
  };

  const createRide = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/rides',
        {
          origin,
          destination,
          dateTime,
          price,
          seatsAvailable: seats,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Ride created');
      setOrigin('');
      setDestination('');
      setDateTime('');
      setPrice(0);
      setSeats(1);
      fetchHistory();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create ride');
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard ({user?.role})</h2>
      {user?.role === 'driver' && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Create Ride</h3>
          <form onSubmit={createRide} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Origin"
              className="border px-3 py-2 rounded"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Destination"
              className="border px-3 py-2 rounded"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
            <input
              type="datetime-local"
              className="border px-3 py-2 rounded"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
            <input
              type="number"
              min={1}
              placeholder="Seats Available"
              className="border px-3 py-2 rounded"
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value))}
              required
            />
            <input
              type="number"
              min={0}
              placeholder="Price (USD)"
              className="border px-3 py-2 rounded"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              required
            />
            <button className="bg-blue-600 text-white py-2 rounded md:col-span-2">Create</button>
          </form>
        </div>
      )}

      {history ? (
        <div>
          <h3 className="text-xl font-semibold mb-2">Ride History</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(history, null, 2)}
          </pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}