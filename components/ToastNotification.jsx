import React from 'react'
import { CgClose } from 'react-icons/cg';

const ToastNotification = ({ notify, message, setNotify, setNotifyMessage }) => {
 
    React.useEffect(() => {
        if (notify) {
            setNotify(true);
            setTimeout(() => {
                setNotify(false);
            }, 3000);
        }
    }, [notify]);
  return notify &&(
    <div className='w-full max-w-md p-4 border rounded bg-gray-50'>
        <div><CgClose onClick={() => {setNotifyMessage(""); setNotify(false)}} className="text-gray-500 cursor-pointer hover:text-red-500"/></div>
        <h3>Notification</h3>
        
        <p className={`text-base`}>{message}</p>
        
    </div>
  )
}

export default ToastNotification