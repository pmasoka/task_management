import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

import ResidentDashboard from "./pages/ResidentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";

function App() {

  /*
    Example authenticated user.
    Later replace this with:
    - Context API
    - Redux
    - /me endpoint
  */

  const user = {
    username: "john",
    role: "resident",
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Resident Routes */}
        <Route
          element={
            <PrivateRoute
              user={user}
              allowedRoles={["resident"]}
            />
          }
        >
          <Route
            path="/resident"
            element={<ResidentDashboard />}
          />
        </Route>

        {/* Staff Routes */}
        <Route
          element={
            <PrivateRoute
              user={user}
              allowedRoles={["staff"]}
            />
          }
        >
          <Route
            path="/staff"
            element={<StaffDashboard />}
          />
        </Route>

        {/* Manager Routes */}
        <Route
          element={
            <PrivateRoute
              user={user}
              allowedRoles={["manager"]}
            />
          }
        >
          <Route
            path="/manager"
            element={<ManagerDashboard />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;