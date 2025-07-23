import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ridesAPI } from '../services/api';
import { Ride } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRides: 0,
    activeRides: 0,
    completedRides: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { rides } = await ridesAPI.getRideHistory({ limit: 5 });
        setRecentRides(rides);

        // Calculate stats
        const totalRides = rides.length;
        const activeRides = rides.filter(ride => 
          ['requested', 'accepted', 'pickup', 'in_progress'].includes(ride.status)
        ).length;
        const completedRides = rides.filter(ride => ride.status === 'completed').length;

        setStats({ totalRides, activeRides, completedRides });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    const colors = {
      requested: 'status-requested',
      accepted: 'status-accepted',
      pickup: 'status-pickup',
      in_progress: 'status-in_progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Ready for your next ride? Book now or check your ride history.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/request-ride"
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl p-6 transition-colors duration-200 block"
        >
          <div className="flex items-center">
            <div className="text-3xl mr-4">🚗</div>
            <div>
              <h3 className="text-lg font-semibold">Request a Ride</h3>
              <p className="text-primary-100">Book your next trip now</p>
            </div>
          </div>
        </Link>

        <Link
          to="/history"
          className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-6 transition-colors duration-200 block"
        >
          <div className="flex items-center">
            <div className="text-3xl mr-4">📋</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ride History</h3>
              <p className="text-gray-600">View all your trips</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <span className="text-blue-600 text-xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Rides</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRides}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <span className="text-yellow-600 text-xl">🚀</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Rides</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeRides}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedRides}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Rides */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Rides</h2>
          <Link
            to="/history"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all
          </Link>
        </div>

        {recentRides.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rides yet</h3>
            <p className="text-gray-600 mb-4">Start your journey by booking your first ride</p>
            <Link to="/request-ride" className="btn-primary">
              Request Ride
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentRides.map((ride) => (
              <div
                key={ride._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                      {ride.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(ride.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {ride.pickupLocation.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    to {ride.destination.address}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${ride.fare.total}</p>
                  <p className="text-sm text-gray-600">{ride.distance.toFixed(1)} km</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;