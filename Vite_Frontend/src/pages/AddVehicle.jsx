import { useState } from "react";
import { showNotification } from "../utils/toast";

const AddVehicle = () => {
  const [form, setForm] = useState({ name: "", capacity: "", tyres: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${API_BASE}/api/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          capacity: form.capacity,
          tyres: form.tyres,
        }),
      });
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        showNotification(
          "success",
          data.data?.message || "Vehicle added successfully"
        );
        setForm({ name: "", capacity: "", tyres: "" });
      } else {
        showNotification("error", data.ms || "Error adding vehicle");
      }
    } catch (err) {
      showNotification("error", err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Vehicle</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Capacity In Kg</label>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            min="1"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Tyres</label>
          <input
            type="number"
            name="tyres"
            value={form.tyres}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            min="1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;
