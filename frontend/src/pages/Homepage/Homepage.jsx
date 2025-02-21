import StayDetailsForm from "./stay-details-form";
import AriaLogo from "@/assets/AriaLogo.png";

const Homepage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-xl md:p-6  space-y-8">
        <img src={AriaLogo} className="mx-auto" width={300} height={120} />

        <div className="space-y-2 text-center">
          {/* <h1 className="text-3xl font-bold">Vacation Feedback</h1> */}
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
