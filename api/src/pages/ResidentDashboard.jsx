// src/pages/ResidentDashboard.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import CreateRequestForm from "../components/CreateRequestForm";
import RequestCard from "../components/RequestCard";

const ResidentDashboard = () => {

  const [requests, setRequests] = useState([]);

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

  useEffect(() => {

    fetchRequests();

  }, []);

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        Resident Dashboard
      </h2>

      <CreateRequestForm
        refreshRequests={fetchRequests}
      />

      {
        requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
          />
        ))
      }

    </div>
  );
};

export default ResidentDashboard;