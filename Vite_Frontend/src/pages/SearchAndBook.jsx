import { useState } from "react";
import { showNotification } from "../utils/toast";

const SearchAndBook = () => {
  const [form, setForm] = useState({
    capacityRequired: "",
    fromPincode: "",
    toPincode: "",
    startTime: "",
  });
  const [vehicles, setVehicles] = useState([]);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVehicles([]);
    setDuration(null);                                          
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      const params = new URLSearchParams({
        capacityRequired: form.capacityRequired,
        fromPincode: form.fromPincode,
        toPincode: form.toPincode,
        startTime: form.startTime,
      }).toString();
      const res = await fetch(`${API_BASE}/api/vehicles/available?${params}`);
      const data = await res.json();
      if (res.ok) {
        setVehicles(data.availableVehicles || []);
        setDuration(data.estimatedRideDurationHours);
        if ((data.availableVehicles || []).length === 0) {
          showNotification("No vehicles available for the given criteria.");
        }
      } else {
        showNotification("error", data.ms || "Error fetching vehicles");
      }
    } catch (err) {
      showNotification("error", err);
    }
    setLoading(false);
  };

  const handleBook = async (vehicleId) => {
    setBookingLoading(vehicleId);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          fromPincode: form.fromPincode,
          toPincode: form.toPincode,
          startTime: form.startTime,
          customerId: "demo-customer-1", // Replace with real customer id in production
        }),
      });
      const { data, error } = await res.json();

      if (res.ok) {
        showNotification("success", data.message || "Booking confirmed");
      } else {
        showNotification("error", error || "Booking failed");
      }
    } catch (err) {
      showNotification("error", err);
    }
    setBookingLoading(null);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Search Available Vehicles</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <div>
          <label className="block mb-1 font-medium">Capacity Required</label>
          <input
            type="number"
            name="capacityRequired"
            value={form.capacityRequired}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            min="1"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">From Pincode</label>
          <input
            type="text"
            name="fromPincode"
            value={form.fromPincode}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">To Pincode</label>
          <input
            type="text"
            name="toPincode"
            value={form.toPincode}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
      {duration !== null && (
        <div className="mb-4 text-center text-sm text-gray-700">
          Estimated Ride Duration:{" "}
          <span className="font-semibold">{duration} hours</span>
        </div>
      )}
      {vehicles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Available Vehicles</h3>
          <ul className="divide-y">
            {vehicles.map((v) => (
              <li
                key={v._id}
                className="py-2 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{v.name}</div>
                  <div className="text-sm text-gray-600">
                    Capacity: {v.capacity} Kg, Tyres: {v.tyres}
                  </div>
                </div>
                <button
                  className="ml-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                  onClick={() => handleBook(v._id)}
                  disabled={bookingLoading === v._id}
                >
                  {bookingLoading === v._id ? "Booking..." : "Book"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchAndBook;
