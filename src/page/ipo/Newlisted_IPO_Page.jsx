import { useEffect, useState } from "react";
import { fetchIposByStatus } from "../../services/api.js";
import IPOCard from "../../utility/IPOCard.jsx";
import { useAuth } from "../../hooks/useAuth.jsx";
import RequireLoginMessage from "../../utility/RequireLoginMessage.jsx";

function Newlisted_IPO_Page() {
  const { user, loading: authLoading } = useAuth();
  const [ipoData, setIpoData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 9;

  useEffect(() => {
    const loadListedIPOs = async () => {
      try {
        setLoading(true);
        const res = await fetchIposByStatus("listed");
        setIpoData(res.data.data.ipos);
      } catch (error) {
        console.error("Error fetching listed IPOs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadListedIPOs();
    }
  }, [user]);

  const totalPages = Math.ceil(ipoData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = ipoData.slice(startIndex, startIndex + itemsPerPage);

  if (authLoading) {
    return <div className="text-center py-10 text-lg">Checking login status...</div>;
  }

  if (!user) {
    return (
      <RequireLoginMessage page="All Newlisted IPOs "/>
    )
  }

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading listed IPOs...</div>;
  }

  return (
    <div className="p-6 rounded-lg shadow-lg mx-16 border border-black mt-4">
      <div className="flex items-center mx-auto">
        <h1 className="text-3xl font-bold mx-auto bg-gradient-to-r from-green-500 via-yellow-500
        to-green-500 text-transparent bg-clip-text cursor-pointer hover:scale-105 transition-transform
        duration-300">
          Recently Listed IPOs
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {currentItems.map((item, index) => (
          <IPOCard key={index} data={item} />
        ))}
      </div>

      <div className="flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`mx-1 mt-2 px-4 py-2 border rounded-md ${
              currentPage === i + 1 ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Newlisted_IPO_Page;
