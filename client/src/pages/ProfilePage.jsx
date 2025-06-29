import React, { useContext } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/chat-app-assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

  const {authUser, updateProfile} = useContext(AuthContext);

  const [selectedImg, setSelectedImg] = useState(null);
 const navigate = useNavigate();
 const [name, setName] = useState(authUser.fullname);
 const [bio, setBio] = useState(authUser.bio);


 const handleSubmit = async (e) => {
  e.preventDefault();
  if(!selectedImg){
    await updateProfile({fullname: name, bio});
     navigate('/');
     return;
  }

 const reader = new FileReader();
 reader.readAsDataURL(selectedImg);
 reader.onload = async() =>{
  const base64Image = reader.result;
  await updateProfile({profilePic: base64Image, fullname: name, bio})
  navigate('/');
 }
}

  return (
    <div className='min-h-screen flex items-center justify-center bg-cover bg-no-repeat'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-3 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e) => setSelectedImg(e.target.files[0])}
            type='file' id='avatar' accept='.png, .jpg , .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}` }/>
            <span className='border-2 rounded-full p-2 bg-gradient-to-r from-purple-500 to-violet-500 text-gray-100'>upload profile picture</span>
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name}
          type="text" required placeholder='Your Name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
          <textarea onChange={(e) => setBio(e.target.value)} value={bio}
          placeholder='Write profile bio' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>
          <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 rounded-full p-2 text-white text-lg cursor-pointer'>Save</button>
        </form>
        <img src={authUser?.profilePic || assets.logo_icon} alt="" className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} />
      </div>
    </div>  
  )
}

export default ProfilePage
