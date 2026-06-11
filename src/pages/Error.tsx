import { useNavigate } from "react-router-dom";
import errImg from "../assets/404_error_illustration.svg";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-[#f5f5f5] px-6 text-center">
      <img src={errImg} alt="404" className="w-150 h-auto" />
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
