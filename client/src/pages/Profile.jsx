import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  // ******* All Pieces of State ********
  // File Pieces of state
  const [file, setFile] = useState(null);
  const [fileUploadPercentage, setFileUploadPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  // User Update Pieces of state
  const [updateSuccess, setUpdateSuccess] = useState(false);
  // Form Data Pieces of state
  const [formData, setFormData] = useState({});
  // Listings pieces of state
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  // REDUX Hooks and Functions
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  // Creating a reference to the file input
  const fileRef = useRef(null);

  // Function to handle Image Upload
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

  // function to handle Listing form changes
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  // Function to handle Listing form submission
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

  // Function to handle Delete User
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

  // function to handle User Signout
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

  // function to handle showing listings
  async function handleShowListings() {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const responseData = await res.json();
      if (responseData.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(responseData);
      console.log(responseData);
    } catch (error) {
      setShowListingsError(true);
    }
  }

  async function handleDeleteListing(id) {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
      });
      const responseData = await res.json();
      if (responseData.success === false) {
        return;
      }
      setUserListings((prevListings) =>
        prevListings.filter((listing) => listing._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  }

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
        <Link
          className="text-white bg-teal-700 p-3 rounded-lg text-center uppercase hover:opacity-95"
          to={"/create-listing"}
        >
          create listing
        </Link>
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
      <button
        onClick={handleShowListings}
        className={`my-3 rounded bg-teal-100 text-teal-700 font-semibold hover:opacity-95 w-fit p-1.5 block mx-auto disabled:bg-slate-100 disabled:text-slate-400 `}
      >
        Show Listings
      </button>
      {showListingsError && (
        <p className="text-red-700 mt-5">Error showing listings</p>
      )}

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-5 mt-8">
          <h1 className="text-2xl font-semibold text-center">Your Listings</h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="flex justify-between items-center border border-slate-300 p-2 rounded-lg hover:shadow-md"
            >
              <Link
                to={`/listing/${listing._id}`}
                className="h-16 w-16 object-contain"
              >
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="object-contain h-full w-full rounded"
                />
              </Link>
              <Link
                to={`/listing/${listing._id}`}
                className="text-center text-slate-700 flex-1 truncate font-semibold hover:text-slate-900"
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col gap-2 ">
                <Link
                  to={`/update-listing/${listing._id}`}
                  className="text-green-700 font-semibold hover:bg-green-100 rounded-lg p-1.5"
                >
                  <MdEdit />
                </Link>
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-700 font-semibold hover:bg-red-100 rounded-lg p-1.5"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
