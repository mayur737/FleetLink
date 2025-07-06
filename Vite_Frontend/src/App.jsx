import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import AddVehicle from "./pages/AddVehicle";
import SearchAndBook from "./pages/SearchAndBook";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import Bookings from "./pages/Bookings";

const Navbar = () => (
  <nav className="bg-gray-100 px-6 py-4 mb-6 flex items-center">
    <Link
      to="/"
      className="mr-6 text-gray-800 hover:text-blue-600 font-semibold"
    >
      Home
    </Link>
    <Link
      to="/vehicles"
      className="mr-6 text-gray-800 hover:text-blue-600 font-semibold"
    >
      Add Vehicle
    </Link>
    <Link
      to="/books"
      className="mr-6 text-gray-800 hover:text-blue-600 font-semibold"
    >
      Search & Book
    </Link>
    <Link
      to="/bookings"
      className="text-gray-800 hover:text-blue-600 font-semibold"
    >
      Bookings
    </Link>
  </nav>
);

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vehicles" element={<AddVehicle />} />
        <Route path="/books" element={<SearchAndBook />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
