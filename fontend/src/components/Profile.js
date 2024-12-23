import React, {useState, useEffect} from "react";
import Header from "./Header";
import bg from '../images/bg1.jpg'
import account from '../images/account-icon.svg'
import { getUserData, updateUserData, uploadProfilePicture } from '../api/auth';
import './Profile.css'
import Gigs from "./Gigs";

function Profile(){
  const [user, setUser] = useState(null);
  const [editForm, setEditForm] = useState(false)
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const id =localStorage.getItem('userEmail')

  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    country: '',
    language: '',
    about: '',
    profession: '',
});

useEffect(() => {
  const fetchUser = async () => {
    try {
      const data = await getUserData(id);
      setUser(data);
      setFormData({
        name: data.name || "",
        contactNumber: data.contactNumber || "",
        country: data.country || "",
        language: data.language || "",
        about: data.about || "",
        profession: data.profession || "",
      });
      setProfilePicture(data.profilePicture || "");
      setProfilePreview(data.profilePicture ? `${data.profilePicture}` : account);
    } catch (error) {
      console.error("Failed to fetch user data:", error.message);
      setErrors((prev) => ({ ...prev, global: "Failed to load profile data." }));
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [id]);

const validateField = (name, value) => {
  switch (name) {
    case "name":
      if (!/^[A-Za-z\s]+$/.test(value)) return "Name must only contain letters and spaces.";
      if (value.length > 15) return "Name must not exceed 15 characters.";
      return "";
    case "contactNumber":
      if (!/^\d{10}$/.test(value)) return "Contact number must be exactly 10 digits.";
      return "";
    case "country":
      return !/^[A-Za-z\s]+$/.test(value) ? "Invalid country name." : "";
    case "language":
      return !/^[A-Za-z\s]+$/.test(value) ? "Invalid language." : "";
    case "about":
      return value.length < 50 ? "Bio is too short." : "";
    case "profession":
      return value.trim() === "" ? "Profession is required." : "";
    default:
      return "";
  }
};
const handleCancelClick = () => {
  setEditForm(false);
  setProfilePreview(user.profilePicture ? `${user.profilePicture}` : account);
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevState) => ({
      ...prevState,
      [name]: value
  }));

  const error = validateField(name, value);
  setErrors((prevState) => ({
      ...prevState,
      [name]: error
  }));
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  const maxFileSize = 2 * 1024 * 1024; // 2 MB
  const validFileTypes = ['image/jpeg', 'image/png'];

  if (file) {
      if (!validFileTypes.includes(file.type)) {
          setErrors((prevState) => ({
              ...prevState,
              profilePicture: 'Only JPEG and PNG files are allowed.',
          }));
          setProfilePicture(null);
          setProfilePreview(null);
          return;
      }

      if (file.size > maxFileSize) {
          setErrors((prevState) => ({
              ...prevState,
              profilePicture: 'File size must not exceed 2 MB.',
          }));
          setProfilePicture(null);
          setProfilePreview(null);
          return;
      }

      setErrors((prevState) => ({
          ...prevState,
          profilePicture: '', 
      }));

      setProfilePicture(file);
      setProfilePreview(URL.createObjectURL(file));
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setFormSubmitting(true);
  const newErrors = {};
  Object.keys(formData).forEach((key) => {
    const error = validateField(key, formData[key]);
    if (error) newErrors[key] = error;
  });

  if (Object.keys(newErrors).length === 0) {
    try {
      await updateUserData(id, formData);
      if (profilePicture && profilePicture instanceof File) {
        const data = new FormData();
        data.append("profilePicture", profilePicture);
        data.append("email", id);
        await uploadProfilePicture(data);
      }
      setEditForm(false);
      const updatedUserData = await getUserData(id);
      setUser(updatedUserData); 
      setProfilePreview(updatedUserData.profilePicture ? `${updatedUserData.profilePicture}` : account);
      alert("Profile Updated Successfully");
    } catch (error) {
      console.error("Failed to update profile:", error.message);
      setErrors((prev) => ({ ...prev, global: "Failed to update profile. Please try again." }));
    }
  } else {
    setErrors(newErrors);
  }
  setFormSubmitting(false);
};

if (loading) return <p>Loading profile...</p>;

return (
  <div>
    {user.role ==="Buyer" || user.role === "Both" ? (<Header />):(<div></div>)}
    {/* <h1>Profile</h1> */}
    {errors.global && <p className="error">{errors.global}</p>}
    {user ? (
      !editForm ? (
        <div className="parent-profile-section">
          <div className="profile-bg">
            <img src={bg} alt="bg" height={'300px'} width={'100%'}/>
          </div>
          <div className="profile-container">
            <div className="profile-img"><img className="profile"  src={profilePreview || account} alt="profile" width={'150px'} height={'150px'}/></div>
            
            <div className="profile-details">
              <h1>{user.name}</h1>
              <p>{user.profession || ''}</p>
              <p>{user.country || ''}</p>
            </div>
            <div className="profile-edit-btn-section"><button className="profile-edit-btn" onClick={() => setEditForm(true)} style={{cursor: "pointer"}}>Edit</button></div>
            
          </div>
          <div className="bio-container">
            <div className="profile-contact">
              <label><strong>Contact</strong></label>
              <p><strong>Contact Number:</strong> {user.contactNumber || ''}</p>
              <p><strong>Email:</strong> {user.email || ''}</p>
              {/* <button>Chat Now</button> */}
            </div>
            <div className="bio-section">
              <h1>Bio</h1>
              <p>{user.about || ''}</p>
            </div>
          </div>
          {user.role ==="Seller" || user.role === "Both" ? (<Gigs />):(<div></div>)}
          
        </div>
        
      ) : (
        <form className="profile-edit-form" onSubmit={handleSubmit}>
          <h3>Edit Profile</h3>
          <div className="profile-picture-section">
            <div className='profile-preview'>
              {profilePreview && <img src={profilePreview} alt="Profile Preview" width={100} height={100} />}
            </div>
            <div className='profile-change'>
              <input
                id="profilePicture"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="profilePicture" className="image-upload-button">
                Change Image
              </label>
              {errors.profilePicture && <p className="error">{errors.profilePicture}</p>}
            </div>
          </div>
          <div className="form-fields">
            <p>Personal Information</p>
            <div className="info">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="error">{errors.name}</p>}
            </div>
            
            <div className="info">
            <label>Email</label>
            <input type="email" name="email" value={user.email} disabled />
            </div>
            
            <div className="info">
            <label>Contact Number</label>
            <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
            {errors.contactNumber && <p className="error">{errors.contactNumber}</p>}
            </div>
            
            <div className="info">
            <label>Profession</label>
            <input type="text" name="profession" value={formData.profession} onChange={handleChange} />
            {errors.profession && <p className="error">{errors.profession}</p>}
            </div>

            {/* <div className="info">
            <label>Profession</label>
            <input type="text" name="profession" value={formData.profession} onChange={handleChange} />
            {errors.profession && <p className="error">{errors.profession}</p>}
            </div> */}
            
            <div className="info">
            <label>Language</label>
            <input type="text" name="language" value={formData.language} onChange={handleChange} />
            {errors.language && <p className="error">{errors.language}</p>}
            </div>
            
            <div className="info">
            <label>Country</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} />
            {errors.country && <p className="error">{errors.country}</p>}
            </div>
            
            <div className="info">
            <label>Bio</label>
            <textarea name="about" value={formData.about} onChange={handleChange} />
            {errors.about && <p className="error">{errors.about}</p>}
            </div>
            <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={handleCancelClick}>Cancel</button>
          </div>
          </div>
          
        </form>
      )
    ) : (
      <p>No user data available.</p>
    )}
  </div>
);

}
export default Profile;