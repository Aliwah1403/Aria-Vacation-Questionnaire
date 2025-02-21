import StayDetailsForm from "./stay-details-form";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-xl p-6 space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Vacation Feedback</h1>
          <p className="text-gray-500">
            Please provide your stay details before proceeding.
          </p>
        </div>

        <StayDetailsForm />
      </div>
    </div>
  );
};

export default Homepage;
