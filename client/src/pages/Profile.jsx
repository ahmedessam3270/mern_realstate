import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/user/userSlice.js";
function Profile() {
  const [file, setFile] = useState(null);
  const [fileUploadPercentage, setFileUploadPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [formData, setFormData] = useState({});

  const dispatch = useDispatch();

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  console.log(formData);

  function handleFileUpload(file) {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUploadPercentage(Math.round(progress));
      },
      () => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({
            ...formData,
            avatar: downloadURL,
          })
        );
      }
    );
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = await res.json();
      if (responseData.success === false) {
        dispatch(updateUserFailure(responseData.message));
        setUpdateSuccess(false);
        return;
      }
      dispatch(updateUserSuccess(responseData));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateSuccess(false);
    }
  }

  async function handleDeleteUser() {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const responseData = res.json();
      if (responseData.success === false) {
        dispatch(deleteUserFailure(responseData.message));
        return;
      }
      dispatch(deleteUserSuccess(responseData));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  async function handleSignout() {
    try {
      dispatch(signoutStart());
      const res = await fetch(`/api/auth/signout`);
      const responseData = await res.json();
      if (responseData.success === false) {
        dispatch(signoutFailure(responseData.message));
        return;
      }
      dispatch(signoutSuccess(responseData));
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  }
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
          hidden
          accept="image/*"
        />
        <img
          src={formData?.avatar || currentUser.avatar}
          onClick={() => fileRef.current.click()}
          alt="profile pic"
          className="w-24 h-24 rounded-full self-center object-cover cursor-pointer mt-2"
        />
        <p className="self-center text-sm font-medium">
          {fileUploadError ? (
            <span className="text-red-700">
              Error image upload (image must be less than 2 mb)
            </span>
          ) : fileUploadPercentage > 0 && fileUploadPercentage < 100 ? (
            <span className="text-slate-700">
              Uploading {fileUploadPercentage}%
            </span>
          ) : fileUploadPercentage === 100 && !fileUploadError ? (
            <span className="text-green-700">Image uploaded successfully!</span>
          ) : null}
        </p>
        <input
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser?.username}
          className="border rounded-lg p-3 focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser?.email}
          className="border rounded-lg p-3 focus:outline-none"
          onChange={handleChange}
        />
        <input
          type="text"
          id="password"
          placeholder="password"
          className="border rounded-lg p-3 focus:outline-none"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 hover:opacity-95 uppercase p-3 rounded-lg text-white disabled:opacity-80"
        >
          {loading ? "loading..." : " update"}
        </button>
      </form>
      <div className="flex justify-between items-center mt-3">
        <span
          className="text-red-700 cursor-pointer font-medium"
          onClick={handleDeleteUser}
        >
          Delete account
        </span>
        <span
          className="text-red-700 cursor-pointer font-medium"
          onClick={handleSignout}
        >
          Sign out
        </span>
      </div>
      <p className="text-center">
        {error && <span className="text-red-700 font-bold">{error}</span>}
        {updateSuccess && (
          <span className="text-green-700 font-bold">
            User updated successfully!
          </span>
        )}
      </p>
    </div>
  );
}

export default Profile;
