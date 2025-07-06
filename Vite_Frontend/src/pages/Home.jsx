const Home = () => {
  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded shadow text-center">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">
        Welcome to FleetLink
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        FleetLink helps you manage your vehicle fleet and bookings with ease.
        <br />
        <span className="block mt-2">
          <b>Add new vehicles</b>, <b>search for available vehicles</b>, and{" "}
          <b>book rides</b> in just a few clicks.
        </span>
      </p>
      <div className="flex flex-col gap-3 items-center">
        <span className="text-gray-600">
          Use the navigation bar above to get started:
        </span>
        <ul className="list-disc list-inside text-left text-gray-600">
          <li>
            <b>Add Vehicle</b>: Register a new vehicle to your fleet.
          </li>
          <li>
            <b>Search & Book</b>: Find available vehicles and book a ride.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
