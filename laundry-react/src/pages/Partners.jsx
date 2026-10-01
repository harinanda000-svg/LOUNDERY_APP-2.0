import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await api.get("/partners");
        setPartners(response.data);
      } catch (error) {
        console.error("Error loading partners", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handleBookNow = (partnerName) => {
    navigate(`/booking?partner=${encodeURIComponent(partnerName)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Laundry Partners</h2>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          Choose from our trusted network of premium laundry service providers.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 text-lg">Loading partners...</p>
        </div>
      ) : partners.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-xl">No partners available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <div key={partner.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900">{partner.name}</h3>
                  <div className="flex items-center bg-blue-50 px-2 py-1 rounded-md text-blue-700 font-semibold text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {partner.rating}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {partner.address}
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Services Provided:</h4>
                  <div className="flex flex-wrap gap-2">
                    {partner.services.map((service, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <button
                  onClick={() => handleBookNow(partner.name)}
                  className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-md"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Partners;
