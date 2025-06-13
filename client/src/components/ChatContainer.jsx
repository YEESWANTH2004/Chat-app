import React, { useRef, useEffect } from 'react'
import { assets, messagesDummyData } from '../assets/chat-app-assets/assets'
import { formatMessageTime } from '../lib/utils';

const ChatContainer = ({ selectedUser, setSelectedUser }) => {

  const scrollEnd = useRef(null);
  useEffect(() =>{
    if(scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  })
  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/* header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={assets.profile_martin} alt="" className='w-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          Martin jhonson
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className='md:hidden max-w-7'
        />
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>
              {/* chat area */} 
      <div className='flex flex-col overflow-y-scroll p-3 pb-6' style={{ height: 'calc(100% - 120px)' }}>

      {messagesDummyData.map((message, index) => {
  const isUser = message.senderId === '680f50e4f10f3cd28382ecf9';

  return (
    <div
      key={index}
      className={`flex items-end gap-2 mb-4 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      {!isUser && (
        <div className='flex flex-col items-center text-xs text-gray-300'>
          <img
            src={assets.profile_martin}
            alt='Martin'
            className='w-7 rounded-full mb-1'
          />
          <p>{formatMessageTime(message.createdAt)}</p>
        </div>
      )}

      {/* Chat bubble or image */}
      {message.image ? (
        <img
          src={message.image}
          alt='Sent media'
          className='max-w-[230px] rounded-lg shadow-md'
        />
      ) : (
        <p
          className={`p-3 max-w-[220px] md:text-sm text-white font-light rounded-lg break-words ${
            isUser
              ? 'bg-violet-600 rounded-bl-xl rounded-tr-xl'
              : 'bg-violet-500/80 rounded-br-xl rounded-tl-xl'
          }`}
        >
          {message.text}
        </p>
      )}

      {isUser && (
        <div className='flex flex-col items-center text-xs text-gray-300'>
          <img
            src={assets.avatar_icon}
            alt='User'
            className='w-7 rounded-full mb-1'
          />
          <p>{formatMessageTime(message.createdAt)}</p>
        </div>
      )}
    </div>
  );
})}
<div ref={scrollEnd}>
</div>
      </div>

{/* bottom area */}
<div className='absolute bottom-0 left-0 right-0 items-center gap-3 p-3'>
 <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full '>
  <input type='text' placeholder='Send a message' 
  className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
  <input type='file' id='image' accept='image/*' hidden  />
  <label htmlFor='image'>
    <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer'/>
  </label>
  <img src={assets.send_button} alt="" className='w-7 cursor-pointer'/>
 </div>
 
</div>


    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} className='max-w-16' alt='' />
      <p className='text-lg font-medium text-white'>chat anytime, Anywhere</p>
    </div>
  )
}

export default ChatContainer
