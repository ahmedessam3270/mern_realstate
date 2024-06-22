import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PropTypes from "prop-types";

function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const response = await fetch(`/api/user/${listing.userRef}`);
        const data = await response.json();
        setLandlord(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-3">
          <p>
            Contact{" "}
            <span className="font-semibold text-slate-900">
              {landlord.username}
            </span>{" "}
            for{" "}
            <span className="font-semibold text-slate-900">
              {listing.name.toLowerCase()}
            </span>
          </p>
          <textarea
            name="message"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="2"
            placeholder="Enter your message here..."
            className="border p-3 rounded-lg h-20 resize-none"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 p-3 text-white hover:opacity-95 rounded-lg uppercase text-center"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}

Contact.propTypes = {
  listing: PropTypes.object.isRequired,
};

export default Contact;
