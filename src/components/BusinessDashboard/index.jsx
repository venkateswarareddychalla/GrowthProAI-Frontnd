import { useState, useEffect, useContext } from "react";
import { BusinessDataContext } from "../../context/BusinessDataContext";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

const apiResponse = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const getRatingFillColor = (rating) => {
  if (rating >= 4.5) return "fill-emerald-500";
  if (rating >= 3.5) return "fill-lime-500";
  if (rating >= 2.5) return "fill-amber-500";
  if (rating >= 1.5) return "fill-orange-500";
  return "fill-red-500";
};

const BusinessDashboard = () => {
  const [apiStatus, setApiStatus] = useState(apiResponse.initial);
  const {
    businessData,
    setBusinessData,
    businessName,
    setBusinessName,
    businessLocation,
    setBusinessLocation,
  } = useContext(BusinessDataContext);

  const navigate = useNavigate();
  let { rating = 4.3, reviews = 271, headline } = businessData;

  const ratingFillColor = getRatingFillColor(rating);

  // Check session state on mount
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    setBusinessData({});
    setBusinessName("");
    setBusinessLocation("");
    navigate("/login", { replace: true });
  };

  // Handle headline regeneration
  const onClickRegenerate = async () => {
    setApiStatus(apiResponse.inProgress);

    const url = `https://growthproai-backend-1-h66o.onrender.com/regenerate-headline?name=${businessName}&location=${businessLocation}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (response.ok) {
      setBusinessData({
        ...businessData,
        headline: data.businessData.headline,
      });
      setApiStatus(apiResponse.success);
    } else {
      setApiStatus(apiResponse.failure);
    }
  };

  // Show refresh error if context is empty but session exists
  if (
    sessionStorage.getItem("isLoggedIn") === "true" &&
    Object.keys(businessData).length === 0
  ) {
    return (
      <div className="max-w-xl w-full mx-auto mt-6 p-6 bg-red-100 rounded-2xl shadow-lg border border-red-200">
        <h2 className="text-xl font-semibold text-red-800">Error</h2>
        <p className="text-red-600">
          Your data is no longer available after refresh. Please log out and
          sign back in to continue.
        </p>
        <button
          onClick={handleLogout}
          className="cursor-pointer outline-none mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout Now
        </button>
      </div>
    );
  }

  const renderData = () => {
    switch (apiStatus) {
      case apiResponse.initial:
        return renderDashboardUI();
      case apiResponse.inProgress:
        return renderLoadingView();
      case apiResponse.success:
        return renderDashboardUI();
      case apiResponse.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  const renderDashboardUI = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f1f5ff] via-[#fafaff] to-[#fdf5ff] px-4 py-8 sm:px-6 sm:py-14">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-10">
          {/* Header */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <h1 className="text-2xl text-center font-bold font-roboto text-gray-900 tracking-tight sm:text-3xl md:text-4xl">
              Business Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="cursor-pointer outline-none px-4 py-2 bg-white text-red-600 font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-red-600 hover:text-white hover:shadow-lg w-full sm:w-auto text-center"
            >
              Logout
            </button>
          </header>

          {/* Card */}
          <section className="bg-white rounded-3xl shadow-2xl p-6 sm:px-8 sm:py-10 md:px-12 md:py-12 border border-gray-200 min-h-[320px] sm:min-h-[380px] md:min-h-[420px]">
            {/* Business Info */}
            <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-10">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl md:text-[1.75rem] font-semibold text-gray-900 leading-snug tracking-wide">
                    {businessName || "Unnamed Business"}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500 mt-1">
                    {businessLocation || "Unknown Location"}
                  </p>
                </div>

                <div className="w-full md:w-auto">
                  <div className="flex items-center justify-start md:justify-end space-x-2">
                    <span
                      className={`text-lg sm:text-xl font-bold ${ratingFillColor.replace(
                        "fill",
                        "text"
                      )}`}
                    >
                      {rating.toFixed(1)}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < Math.round(rating)
                              ? ratingFillColor
                              : "fill-gray-200"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.12 3.437a1 1 0 00.95.69h3.616c.969 0 1.371 1.24.588 1.81l-2.924 2.12a1 1 0 00-.364 1.118l1.12 3.437c.3.921-.755 1.688-1.538 1.118l-2.924-2.12a1 1 0 00-1.176 0l-2.924 2.12c-.783.57-1.838-.197-1.538-1.118l1.12-3.437a1 1 0 00-.364-1.118L2.343 8.864c-.783-.57-.38-1.81.588-1.81h3.616a1 1 0 00.95-.69l1.12-3.437z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm sm:text-md font-semibold text-black-400 mt-1">
                    ({reviews || "0"} reviews)
                  </p>
                </div>
              </div>
            </div>

            {/* SEO Headline */}
            <div className="mb-8 sm:mb-10">
              <h3 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">
                Suggested SEO Headline
              </h3>
              <div className="bg-green-100 border border-gray-200 rounded-xl px-4 py-3 sm:px-6 sm:py-5 text-base sm:text-lg text-pink-800 font-bold shadow-inner">
                {headline || "No headline available. Please generate one."}
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center sm:justify-end">
              <button
                onClick={onClickRegenerate}
                className="cursor-pointer outline-none relative overflow-hidden px-4 py-2.5 sm:px-6 sm:py-3 bg-gray-900 text-white font-medium text-xs sm:text-sm rounded-md shadow-xl hover:shadow-2xl transition-all duration-300 group w-full sm:w-auto text-center"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 opacity-0 group-hover:opacity-20 transition duration-300 blur-sm" />
                Regenerate SEO Headline
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderLoadingView = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <ThreeDots
          height="40"
          width="80"
          radius="9"
          color="#000000" // Tailwind's indigo-600
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  };

  const renderFailureView = () => {
    return (
      <div className="text-red-500 flex items-center">
        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Failed to regenerate. Please try again.
      </div>
    );
  };

  return <>{renderData()}</>;
};

export default BusinessDashboard;
