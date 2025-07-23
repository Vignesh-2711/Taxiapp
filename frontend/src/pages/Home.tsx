import { useEffect, useState } from 'react';
import axios from 'axios';
import RideList from '../components/RideList';
import RideMap from '../components/RideMap';

export default function Home() {
  const [rides, setRides] = useState<any[]>([]);

  const fetchRides = async () => {
    const res = await axios.get('/api/rides', { baseURL: 'http://localhost:5000' });
    setRides(res.data);
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <RideMap />
      <RideList rides={rides} />
    </div>
  );
}