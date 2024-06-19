import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { listingId } = useParams();

  // to use the Swiper Navigation module
  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/listing/get/${listingId}`);
        const data = await response.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setLoading(false);
        setError(false);
        setListing(data);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);
  return (
    <main>
      {loading && (
        <p className="text-center my-7 text-2xl font-semibold">Loading...</p>
      )}
      {error && (
        <p className="text-center my-7 text-2xl font-semibold">
          Something went wrong.
        </p>
      )}
      {listing && !error && !loading && (
        <Swiper navigation>
          {listing.imageUrls.map((imgUrl) => (
            <SwiperSlide key={imgUrl}>
              <img
                src={imgUrl}
                alt="listing"
                className="w-full h-96 object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </main>
  );
}

export default Listing;
