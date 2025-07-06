import React, { useContext, useState } from "react";
import { BusinessDataContext } from "../../context/BusinessDataContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { setBusinessData, setBusinessName, setBusinessLocation } =
    useContext(BusinessDataContext);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmitBusinessForm = async (e) => {
    e.preventDefault();
    const formData = {
      businessName: e.target.businessName.value,
      businessLocation: e.target.businessLocation.value,
    };

    const response = await fetch("https://growthproai-backend-1-h66o.onrender.com/business-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      // Set session flag and store data in context
      sessionStorage.setItem("isLoggedIn", "true");
      setBusinessData(data.businessData);
      setBusinessName(formData.businessName);
      setBusinessLocation(formData.businessLocation);
      navigate("/", { replace: true });
    } else {
      setError(true);
      setErrorMessage(data.errorMessage);
    }
  };

  return (
  <div className="min-h-screen min-w-[320px] flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-purple-100 px-2 sm:px-4 md:px-6 lg:px-8">
    {/* Container with responsive sizing */}
    <div className="w-full max-w-[420px] md:max-w-[500px] lg:max-w-[600px] backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border border-white/30 dark:border-gray-700/30 shadow-2xl rounded-3xl p-4 sm:p-6 md:p-8">
      {/* Heading with responsive sizing */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
        Business Information
      </h2>
      
      {/* Subtitle with responsive sizing */}
      <p className="mt-2 text-xs sm:text-sm md:text-base text-center text-gray-600 dark:text-gray-300">
        Help us tailor your experience.
      </p>

      {/* Form with responsive spacing */}
      <form 
        onSubmit={onSubmitBusinessForm} 
        className="mt-4 sm:mt-6 md:mt-8 space-y-4 sm:space-y-6 md:space-y-8"
      >
        {/* Business Name Field */}
        <div className="space-y-1 md:space-y-2">
          <label
            htmlFor="businessName"
            className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300"
          >
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            placeholder="Enter full business name"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 text-xs sm:text-sm md:text-base text-gray-900 dark:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>

        {/* Business Location Field */}
        <div className="space-y-1 md:space-y-2">
          <label
            htmlFor="businessLocation"
            className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300"
          >
            Business Location
          </label>
          <input
            type="text"
            id="businessLocation"
            name="businessLocation"
            placeholder="Enter business location"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 text-xs sm:text-sm md:text-base text-gray-900 dark:text-white shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>

        {/* Submit Button with Glowing Gradient */}
        <div className="w-full relative inline-flex items-center justify-center gap-4 group mt-3 md:mt-4">
          <div className="absolute inset-0 transition-all duration-1000 opacity-60 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
          <button
            type="submit"
            className="cursor-pointer outline-none w-full relative inline-flex items-center justify-center text-xs sm:text-sm md:text-base rounded-xl bg-gray-900 px-8 py-3 md:py-4 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30 z-10"
          >
            Submit
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-xs sm:text-sm md:text-base font-medium text-red-600 dark:text-red-400 mt-1 ml-1">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  </div>
);
};

export default LoginForm;
