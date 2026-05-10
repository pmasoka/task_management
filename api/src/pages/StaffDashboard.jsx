
import { useEffect, useState } from "react";
import axios from "axios";

import RequestCard from "../components/RequestCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const StaffDashboard = () => {

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        "http://127.0.0.1:8000/api/requests/",
        {
          withCredentials: true,
        }
      );

      setTasks(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchTasks();

  }, []);

  return (
    <div className="container mt-4">

      <h2 className="mb-4">
        Staff Dashboard
      </h2>

      {
        loading && <LoadingSpinner />
      }

      {
        !loading &&
        tasks.length === 0 && (

          <EmptyState
            message="No maintenance tasks assigned to you yet."
          />
        )
      }

      {
        !loading &&
        tasks.map((task) => (

          <RequestCard
            key={task.id}
            request={task}
          />
        ))
      }

    </div>
  );
};

export default StaffDashboard;