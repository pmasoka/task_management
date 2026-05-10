
const StatusBadge = ({ status }) => {

  let badgeClass = "bg-secondary";

  if (status === "pending") {
    badgeClass = "bg-warning text-dark";
  }

  if (status === "in_progress") {
    badgeClass = "bg-primary";
  }

  if (status === "completed") {
    badgeClass = "bg-success";
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {status.replace("_", " ")}
    </span>
  );
};

export default StatusBadge;