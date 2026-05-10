// src/components/StaffAssignment.jsx

import { useState } from "react";
import axios from "axios";

const StaffAssignment = ({
  requestId,
  staffUsers,
  refreshRequests,
}) => {

  const [selectedStaff, setSelectedStaff] = useState("");

  const assignTask = async () => {

    try {

      await axios.patch(
        `http://127.0.0.1:8000/api/requests/${requestId}/`,
        {
          assigned_to: selectedStaff,
          status: "in_progress",
        },
        {
          withCredentials: true,
        }
      );

      alert("Task Assigned");

      refreshRequests();

    } catch (error) {

      console.log(error);
      alert("Assignment failed");
    }
  };

  return (
    <div className="mt-3">

      <select
        className="form-control mb-2"
        value={selectedStaff}
        onChange={(e) => setSelectedStaff(e.target.value)}
      >

        <option value="">
          Select Staff
        </option>

        {
          staffUsers.map((staff) => (
            <option
              key={staff.id}
              value={staff.id}
            >
              {staff.username}
            </option>
          ))
        }

      </select>

      <button
        className="btn btn-success"
        onClick={assignTask}
      >
        Assign
      </button>

    </div>
  );
};

export default StaffAssignment;