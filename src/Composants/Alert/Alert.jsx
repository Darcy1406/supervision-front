import React, { useRef } from 'react';
import './Alert.css';

export function Alert({message="", icon="", setMessage, bgColor, borderColor}) {
  const alert = useRef(null);

  const close_alert = () => {
    // alert.current.classList.remove('show');
    alert.current.classList.add('hide');
    setTimeout(() => {
      setMessage("");
    }, 600)
    
  }


  return (
    <div className={`alert show ${bgColor} border ${borderColor} w-110 h-18 rounded-3xl shadow-lg flex justify-center items-center gap-2 z-30`} ref={alert}>

      <div className='container-icon w-10'>
        <span className='icon text-2xl ml-2'>
          <i className={icon}></i>
        </span>
      </div>

      <div className='container-mesage w-90'>
        <p className='text-base'>
          {message}
        </p>
      </div>

      <div className='container-close-message w-10 cursor-pointer mr-2'>
        <span className='icon text-2xl' onClick={close_alert}>
          <i className='fas fa-times'></i>
        </span>
      </div>
    
    </div>
  )
}
