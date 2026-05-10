// src/pages/ResidentDashboard.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import CreateRequestForm from "../components/CreateRequestForm";
import RequestCard from "../components/RequestCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const ResidentDashboard = () => {

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        "http://127.0.0.1:8000/api/requests/",
        {
          withCredentials: true,
        }
      );

      setRequests(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
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

      {/* LOADING */}

      {
        loading && <LoadingSpinner />
      }

      {/* EMPTY STATE */}

      {
        !loading &&
        requests.length === 0 && (

          <EmptyState
            message="You have not created any maintenance requests yet."
          />
        )
      }

      {/* REQUEST LIST */}

      {
        !loading &&
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