import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext"; 
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { currentUser } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        if (currentUser && currentUser._id) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/users/${currentUser._id}`,
            {
              withCredentials: true,
            }
          );
          setUserInfo(response.data);
        } else {
          setError("User is not logged in.");
        }
      } catch (err) {
        setError("Failed to fetch user information.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      {userInfo && (
        <>
          <h1 className="profile-heading">{userInfo.username}'s Profile</h1>
          <img src={userInfo.img} alt="Profile" className="user-image" />
          <p className="profile-pera">Email: {userInfo.email}</p>
          <p className="profile-pera">Country: {userInfo.country}</p>
          <p className="profile-pera">Joined on: {new Date(userInfo.createdAt).toLocaleDateString()}</p>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
