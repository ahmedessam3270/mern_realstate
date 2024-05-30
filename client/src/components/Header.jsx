import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="shadow-md bg-slate-200">
      <div className="flex justify-between items-center mx-auto max-w-6xl p-3">
        <Link to={"/"}>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Ahmed</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-100 rounded-lg p-3 flex items-center">
          <input
            type="search"
            placeholder="Search...."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
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
