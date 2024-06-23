import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);
  return (
    <header className="shadow-md bg-slate-200">
      <div className="flex justify-between items-center mx-auto max-w-6xl p-3">
        <Link to={"/"}>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Ahmed</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          className="bg-slate-100 rounded-lg p-3 flex items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="search"
            placeholder="Search...."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4 font-semibold items-center">
          <Link to={"/"}>
            <li className="hidden sm:inline text-slate-600 hover:text-slate-900">
              Home
            </li>
          </Link>
          <Link to={"/about"}>
            <li className="hidden sm:inline text-slate-600 hover:text-slate-900">
              About
            </li>
          </Link>

          <Link to={"/profile"}>
            {currentUser ? (
              <img
                // src={currentUser.avatar.split("=")[0] + "=s100"}
                src={currentUser.avatar}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <li className="text-slate-600 hover:text-slate-900">Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
