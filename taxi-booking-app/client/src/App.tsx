import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">Taxi Booking App</h1>
        <nav className="space-x-4">
          <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Login</a>
          <a href="#" className="text-gray-700 hover:text-blue-600">Register</a>
        </nav>
      </header>
      <main className="p-8 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-4">Welcome to the Taxi Booking App</h2>
        <p className="text-gray-600 mb-8">Book a ride, become a driver, or view your ride history.</p>
        <div className="flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Book a Ride</button>
          <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Become a Driver</button>
        </div>
      </main>
    </div>
  );
}

export default App;
