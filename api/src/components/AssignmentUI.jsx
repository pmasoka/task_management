
import { useState } from "react";
import axios from "axios";

const AssignmentUI = ({
  requestId,
  staffUsers,
  refreshRequests,
}) => {

  const [selectedStaff, setSelectedStaff] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  // =========================
  // ASSIGN TASK
  // =========================

  const handleAssign = async () => {

    setSuccessMessage("");
    setErrorMessage("");

    if (!selectedStaff) {

      setErrorMessage(
        "Please select a staff user."
      );

      return;
    }

    try {

      setLoading(true);

      await axios.patch(
        `http://127.0.0.1:8000/api/requests/${requestId}/assign/`,
        {
          assigned_to: selectedStaff,
        },
        {
          withCredentials: true,
        }
      );

      setSuccessMessage(
        "Task assigned successfully."
      );

      // Refresh dashboard data
      refreshRequests();

      // Reset dropdown
      setSelectedStaff("");

    } catch (error) {

      console.log(error);

      if (error.response?.data) {

        setErrorMessage(
          JSON.stringify(error.response.data)
        );

      } else {

        setErrorMessage(
          "Assignment failed."
        );
      }

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border-top pt-3">

      <h6 className="mb-3">
        Assign Maintenance Staff
      </h6>

      {/* SUCCESS */}

      {
        successMessage && (
          <div className="alert alert-success py-2">
            {successMessage}
          </div>
        )
      }

      {/* ERROR */}

      {
        errorMessage && (
          <div className="alert alert-danger py-2">
            {errorMessage}
          </div>
        )
      }

      {/* DROPDOWN */}

      <select
        className="form-select mb-3"
        value={selectedStaff}
        onChange={(e) =>
          setSelectedStaff(e.target.value)
        }
      >

        <option value="">
          Select Staff User
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

      {/* BUTTON */}

      <button
        className="btn btn-success"
        onClick={handleAssign}
        disabled={loading}
      >

        {
          loading
            ? "Assigning..."
            : "Assign Task"
        }

      </button>

    </div>
  );
};

export default AssignmentUI;