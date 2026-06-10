import { useNavigate } from "react-router-dom";
import errImg from "../assets/404.svg";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-[#f5f5f5] px-6 text-center">
      <img src={errImg} alt="404" className="w-64 h-auto" />
      <h2 className="text-2xl font-bold text-gray-800">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 font-medium">
        This page doesn't exist or has been removed.
        <br />
        We suggest you go back.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-2 w-[163px] h-[50px] rounded-[56px] bg-[#7c3aed] text-white font-semibold cursor-pointer border-none hover:bg-[#6d28d9] transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};

export default ErrorPage;
