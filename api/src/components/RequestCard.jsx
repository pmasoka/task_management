const RequestCard = ({ request, children }) => {

  return (
    <div className="card mb-3 shadow-sm">

      <div className="card-body">

        <div className="d-flex justify-content-between">

          <h5>{request.title}</h5>

          <span className="badge bg-primary">
            {request.status}
          </span>

        </div>

        <p>{request.description}</p>

        <p>
          <strong>Priority:</strong> {request.priority}
        </p>

        <p>
          <strong>Created By:</strong> {request.created_by_username}
        </p>

        <p>
          <strong>Assigned To:</strong>

          {
            request.assigned_to_username
              ? request.assigned_to_username
              : " Unassigned"
          }
        </p>

        {children}

      </div>

    </div>
  );
};

export default RequestCard;