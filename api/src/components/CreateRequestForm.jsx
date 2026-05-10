import { useState } from "react";
import axios from "axios";

const CreateRequestForm = ({ refreshRequests }) => {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://127.0.0.1:8000/api/requests/",
        formData,
        {
          withCredentials: true,
        }
      );

      alert("Request Created");

      setFormData({
        title: "",
        description: "",
        priority: "medium",
      });

      refreshRequests();

    } catch (error) {

      console.log(error);
      alert("Error creating request");
    }
  };

  return (
    <div className="card p-4 mb-4">

      <h4>Create Maintenance Request</h4>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          className="form-control mb-3"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          className="form-control mb-3"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <select
          name="priority"
          className="form-control mb-3"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button className="btn btn-primary">
          Submit Request
        </button>

      </form>

    </div>
  );
};

export default CreateRequestForm;