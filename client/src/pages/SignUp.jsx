import { Link } from "react-router-dom";
function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl my-7 font-semibold text-center">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="uppercase text-white bg-slate-700 hover:opacity-95 p-3 rounded-lg disabled:opacity-80">
          sign up
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
