
const EmptyState = ({ message }) => {

  return (
    <div className="card p-5 text-center shadow-sm">

      <h5 className="mb-3">
        No Requests Found
      </h5>

      <p className="text-muted">
        {message}
      </p>

    </div>
  );
};

export default EmptyState;