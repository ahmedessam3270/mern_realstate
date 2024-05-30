import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
function Profile() {
  const [file, setFile] = useState(null);
  const [fileUploadPercentage, setFileUploadPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  const { currentUser } = useSelector((state) => state.user);
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
        console.log(fileUploadPercentage);
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
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className="max-w-lg p-3 mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar || currentUser.avatar}
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
