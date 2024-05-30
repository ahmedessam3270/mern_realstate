import { useSelector } from "react-redux";
function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt="profile pic"
          className="w-24 h-24 rounded-full self-center object-cover cursor-pointer mt-2"
        />
        <input
          type="text"
          id="username"
          placeholder="username"
          // defaultValue={currentUser.username}
          className="border rounded-lg p-3 focus:outline-none"
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          // defaultValue={currentUser.email}
          className="border rounded-lg p-3 focus:outline-none"
        />
        <input
          type="text"
          id="password"
          placeholder="password"
          className="border rounded-lg p-3 focus:outline-none"
        />
        <button className="bg-slate-700 hover:opacity-95 uppercase p-3 rounded-lg text-white disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between items-center mt-3">
        <span className="text-red-700 cursor-pointer font-medium">
          Delete account
        </span>
        <span className="text-red-700 cursor-pointer font-medium">
          Sign out
        </span>
      </div>
    </div>
  );
}

export default Profile;
