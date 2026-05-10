
import { useState } from "react";
import axios from "axios";

const CreateRequestForm = ({ refreshRequests }) => {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const [errors, setErrors] = useState({});

  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT CHANGES
  // =========================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear field error while typing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  // =========================
  // FRONTEND VALIDATION
  // =========================

  const validateForm = () => {

    let newErrors = {};

    if (formData.title.trim().length < 3) {

      newErrors.title =
        "Title must be at least 3 characters.";
    }

    if (formData.description.trim().length < 10) {

      newErrors.description =
        "Description must be at least 10 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================
  // SUBMIT FORM
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSuccessMessage("");

    // Stop if validation fails
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {

      await axios.post(
        "http://127.0.0.1:8000/api/requests/",
        formData,
        {
          withCredentials: true,
        }
      );

      // Success message
      setSuccessMessage(
        "Maintenance request submitted successfully."
      );

      // Reset form
      setFormData({
        title: "",
        description: "",
        priority: "medium",
      });

      // Refresh dashboard list
      refreshRequests();

      // Clear errors
      setErrors({});

    } catch (error) {

      console.log(error);

      // =========================
      // DJANGO VALIDATION ERRORS
      // =========================

      if (error.response?.data) {

        setErrors(error.response.data);

      } else {

        alert(
          "Something went wrong. Please try again."
        );
      }

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm p-4 mb-4">

      <h4 className="mb-4">
        Create Maintenance Request
      </h4>

      {/* SUCCESS MESSAGE */}

      {
        successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )
      }

      <form onSubmit={handleSubmit}>

        {/* TITLE */}

        <div className="mb-3">

          <label className="form-label">
            Title
          </label>

          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
          />

          {
            errors.title && (
              <div className="text-danger mt-1">
                {errors.title}
              </div>
            )
          }

        </div>

        {/* DESCRIPTION */}

        <div className="mb-3">

          <label className="form-label">
            Description
          </label>

          <textarea
            name="description"
            rows="4"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
          />

          {
            errors.description && (
              <div className="text-danger mt-1">
                {errors.description}
              </div>
            )
          }

        </div>

        {/* PRIORITY */}

        <div className="mb-4">

          <label className="form-label">
            Priority
          </label>

          <select
            name="priority"
            className="form-select"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>

          </select>

        </div>

        {/* SUBMIT BUTTON */}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >

          {
            loading
              ? "Submitting..."
              : "Submit Request"
          }

        </button>

      </form>

    </div>
  );
};

export default CreateRequestForm;