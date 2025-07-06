import React, { useEffect, useState } from "react";
import { showNotification } from "../utils/toast";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
        const res = await fetch(`${API_BASE}/api/bookings/demo-customer-1`);
        const { data, error } = await res.json();
        if (res.ok) {
          const bookingsArr = data?.bookings || data?.data?.bookings || [];
          setBookings(bookingsArr);
        } else {
          showNotification("error", error || "Failed to fetch bookings");
        }
      } catch (err) {
        showNotification("error", err || "Error fetching bookings");
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const handleCancel = async (_id) => {
    setCancelLoading(_id);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${API_BASE}/api/bookings/${_id}`, {
        method: "DELETE",
      });
      const { data, error } = await res.json();
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b._id !== _id));
        showNotification("success", data?.message || "Booking cancelled");
      } else {
        showNotification("error", error || "Failed to cancel booking");
      }
    } catch (err) {
      showNotification("error", err || "Error cancelling booking");
    }
    setCancelLoading(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Bookings</h2>
      {bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <ul className="divide-y">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="py-2 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">Booking ID: {booking._id}</div>
                <div>Vehicle ID: {booking.vehicleId}</div>
                <div>
                  From: {booking.fromPincode} &rarr; To: {booking.toPincode}
                </div>
                <div>
                  Start: {new Date(booking.startTime).toLocaleString()}
                  <br />
                  End: {new Date(booking.endTime).toLocaleString()}
                </div>
              </div>
              <button
                className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                onClick={() => handleCancel(booking._id)}
                disabled={cancelLoading === booking._id}
              >
                {cancelLoading === booking._id ? "Cancelling..." : "Cancel"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookings;
