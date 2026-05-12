import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import PrivateRoute from "./routes/PrivateRoute";

import Login from "./pages/Login";

import Unauthorized from "./pages/Unauthorized";

import ResidentDashboard from "./pages/ResidentDashboard";

import StaffDashboard from "./pages/StaffDashboard";

import ManagerDashboard from "./pages/ManagerDashboard";


function App() {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);


  // =========================
  // CHECK SESSION
  // =========================

  useEffect(() => {

    fetch(
      "http://127.0.0.1:8000/api/session/",
      {
        credentials: "include",
      }
    )
      .then((response) => response.json())

      .then((data) => {

        if (data.isAuthenticated) {

          setUser({
            username: data.username,
            role: data.role,
          });
        }

        setLoading(false);
      })

      .catch((error) => {

        console.error(error);

        setLoading(false);
      });

  }, []);


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return <h3>Loading...</h3>;
  }


  return (

    <BrowserRouter>

      <Routes>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Public */}
        <Route
          path="/login"
          element={
            <Login setUser={setUser} />
          }
        />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />


        {/* Resident */}
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


        {/* Staff */}
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


        {/* Manager */}
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


        {/* Catch All */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;