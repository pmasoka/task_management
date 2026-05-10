// src/pages/ManagerDashboard.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import RequestCard from "../components/RequestCard";
import StaffAssignment from "../components/StaffAssignment";

const ManagerDashboard = () => {

  const [requests, setRequests] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);

  const fetchRequests = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/api/requests/",
        {
          withCredentials: true,
        }
      );

      setRequests(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const fetchStaffUsers = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/api/staff-users/",
        {
          withCredentials: true,
        }
      );

      setStaffUsers(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchRequests();
    fetchStaffUsers();

  }, []);

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        Manager Dashboard
      </h2>

      {
        requests.map((request) => (

          <RequestCard
            key={request.id}
            request={request}
          >

            <StaffAssignment
              requestId={request.id}
              staffUsers={staffUsers}
              refreshRequests={fetchRequests}
            />

          </RequestCard>
        ))
      }

    </div>
  );
};

export default ManagerDashboard;