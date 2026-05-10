
const LoadingSpinner = () => {

  return (
    <div className="text-center my-5">

      <div
        className="spinner-border"
        role="status"
      >
      </div>

      <p className="mt-3">
        Loading requests...
      </p>

    </div>
  );
};

export default LoadingSpinner;