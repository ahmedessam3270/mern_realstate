import { useState } from "react";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [submittingError, setSubmittingError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  function handleUploadImage() {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setUploading(false);
          setImageUploadError("Image upload failed (2 mb max per image)");
        });
    } else {
      setUploading(false);
      setImageUploadError("You can only upload 6 image per listing");
    }
  }

  async function storeImage(file) {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  }

  function handleRemoveImage(idx) {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== idx),
    });
  }
  console.log(formData);

  function handleChange(e) {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setSubmittingError("Please upload at least one image");

      if (+formData.regularPrice < +formData.discountedPrice)
        return setSubmittingError(
          "Discounted price must be lower than regular price"
        );
      setSubmitting(true);
      setSubmittingError(false);
      const response = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const responseData = await response.json();
      setSubmitting(false);
      if (responseData.success === false) {
        setSubmittingError(responseData.message);
      }
      navigate(`/listing/${responseData._id}`);
    } catch (error) {
      setSubmittingError("Error submitting the form");
      setSubmitting(false);
    }
  }

  return (
    <main className="p-3 mx-auto max-w-5xl">
      <h1 className="text-3xl text-center font-semibold my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="border p-3 rounded-lg"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            id="description"
            className="border p-3 rounded-lg h-20 resize-none"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            className="border p-3 rounded-lg"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sell"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sell"}
              />
              <label htmlFor="sell">Sell</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <label htmlFor="parking">Parking spot</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="20"
                required
                className="p-2 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <label htmlFor="bedrooms">Beds</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-2 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <label htmlFor="bathrooms">Baths</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-2 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <label
                htmlFor="regularPrice"
                className="flex flex-col items-center"
              >
                <p>Regular Price</p>
                <p className="text-xs">($ / month)</p>
              </label>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountedPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-2 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountedPrice}
                />
                <label
                  htmlFor="discountedPrice"
                  className="flex flex-col items-center"
                >
                  <p>Discounted Price</p>
                  <p className="text-xs">($ / month)</p>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold text-center">
            Images:
            <span className="text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              multiple
              id="images"
              className="border p-3 border-gray-300 rounded w-full"
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              onClick={handleUploadImage}
              disabled={uploading}
              type="button"
              className={`border text-green-600 border-green-600 px-3 py-1 rounded uppercase ${
                uploading === false && "hover:bg-green-600 hover:text-white"
              } transition-all disabled:text-gray-400 disabled:border-gray-400`}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-sm text-red-700 text-center">
              {imageUploadError}
            </p>
          )}

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                className="flex justify-between items-center p-3 border rounded"
                key={url}
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-700 font-semibold bg-red-100 rounded-lg p-2 hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={submitting || uploading}
            className={`text-white bg-slate-700 ${
              (!submitting || !uploading) && "hover:opacity-95"
            } p-3 uppercase rounded disabled:opacity-80`}
          >
            {submitting ? "Creating..." : "Create Listing"}
          </button>
          {submittingError && (
            <p className="text-sm text-red-700 text-center">
              {submittingError}
            </p>
          )}
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
