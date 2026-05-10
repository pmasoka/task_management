// src/pages/StaffDashboard.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import RequestCard from "../components/RequestCard";

const StaffDashboard = () => {

  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/api/requests/",
        {
          withCredentials: true,
        }
      );

      setTasks(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const updateStatus = async (
    requestId,
    status
  ) => {

    try {

      await axios.patch(
        `http://127.0.0.1:8000/api/requests/${requestId}/`,
        {
          status,
        },
        {
          withCredentials: true,
        }
      );

      fetchTasks();

    } catch (error) {

      console.log(error);
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
        tasks.map((task) => (

          <RequestCard
            key={task.id}
            request={task}
          >

            <div className="mt-3">

              <button
                className="btn btn-warning me-2"
                onClick={() =>
                  updateStatus(
                    task.id,
                    "in_progress"
                  )
                }
              >
                In Progress
              </button>

              <button
                className="btn btn-success"
                onClick={() =>
                  updateStatus(
                    task.id,
                    "completed"
                  )
                }
              >
                Completed
              </button>

            </div>

          </RequestCard>
        ))
      }

    </div>
  );
};

export default StaffDashboard;