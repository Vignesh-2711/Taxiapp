import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface Props {
  rides: any[];
}

export default function RideList({ rides }: Props) {
  const { token, user } = useAuth();

  const bookRide = async (rideId: string) => {
    try {
      await axios.post(
        `/api/rides/${rideId}/book`,
        {},
        {
          baseURL: 'http://localhost:5000',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Ride booked!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error booking ride');
    }
  };

  return (
    <div className="space-y-4">
      {rides.map((ride) => (
        <div key={ride.id} className="bg-white shadow rounded p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold">
              {ride.origin} → {ride.destination}
            </p>
            <p className="text-sm text-gray-500">{new Date(ride.dateTime).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-600">${ride.price}</span>
            {user?.role === 'passenger' && (
              <button
                onClick={() => bookRide(ride.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Book
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}