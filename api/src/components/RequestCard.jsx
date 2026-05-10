
import StatusBadge from "./StatusBadge";

const RequestCard = ({
  request,
  children,
}) => {

  return (
    <div className="card shadow-sm mb-4 border-0">

      <div className="card-body">

        {/* HEADER */}

        <div className="d-flex justify-content-between align-items-center mb-3">

          <h5 className="card-title mb-0">
            {request.title}
          </h5>

          <StatusBadge
            status={request.status}
          />

        </div>

        {/* DESCRIPTION */}

        <p className="card-text">
          {request.description}
        </p>

        {/* DETAILS */}

        <div className="row mt-3">

          <div className="col-md-6 mb-2">

            <strong>Priority:</strong>{" "}

            <span className="text-capitalize">
              {request.priority}
            </span>

          </div>

          <div className="col-md-6 mb-2">

            <strong>Created By:</strong>{" "}

            {request.created_by}

          </div>

          <div className="col-md-6 mb-2">

            <strong>Assigned To:</strong>{" "}

            {
              request.assigned_to
                ? request.assigned_to
                : "Unassigned"
            }

          </div>

          <div className="col-md-6 mb-2">

            <strong>Created:</strong>{" "}

            {
              new Date(
                request.created_at
              ).toLocaleString()
            }

          </div>

        </div>

        {/* EXTRA ACTIONS */}

        {
          children && (
            <div className="mt-4">
              {children}
            </div>
          )
        }

      </div>

    </div>
  );
};

export default RequestCard;