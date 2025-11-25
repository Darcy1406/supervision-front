import { useEffect, useRef } from 'react'
import './Modal.css';

export default function Modal({children, isVisible, setIsvisible, width_children='w-3/4'}) {
  const modal = useRef(null);

  const show_modal = () => {
    modal.current.classList.add('show');
  }
  
  const close_modal = () => {
    modal.current.classList.remove('show');
    setIsvisible(false);
  }

  
  useEffect(() => {
    if(isVisible){
      show_modal();
    }else{
      close_modal();
    }
  }, [isVisible])
  
  
  return (
    <div id='modal' ref={modal}>
      <div className={`content-modal ${width_children} bg-white rounded-lg my-2 px-2 pb-4`}>
        <div className='container-btn-close'>
          <span className='icone is-pulled-right text-red-500 text-xl cursor-pointer duration-150 ease-out hover:text-red-600' onClick={close_modal}>
          <i className='fas fa-times-circle'></i>
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
