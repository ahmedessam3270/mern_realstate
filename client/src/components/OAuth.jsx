import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice.js";
function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handleGoogleAuth() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await response.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.error("Could not sign in with google", error);
    }
  }

  return (
    <button
      onClick={handleGoogleAuth}
      type="button"
      className="text-white bg-sky-700 rounded-lg uppercase hover:opacity-95 p-3"
    >
      continue with google
    </button>
  );
}

export default OAuth;
