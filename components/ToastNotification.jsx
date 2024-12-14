/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';

const ToastNotification = ({ notify, message, setNotify, setNotifyMessage }) => {
  const [timer, setTimer] = useState(5); // Default timer of 5 seconds

  useEffect(() => {
    if (notify) {
      // Start the countdown only when `notify` is true
      countDown();
    }
  }, [notify]);

  const countDown = () => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(intervalId);
          setNotify(false);
          return 0;
        }
      });
    }, 1000);
  };

  return notify && (
    <div className="relative w-full max-w-md p-6 border border-yellow-500 rounded bg-gray-50">
      <div className="absolute flex justify-end w-full right-2 top-2">
        <CgClose
          onClick={() => {
            setNotifyMessage('');
            setNotify(false);
          }}
          className="text-2xl text-gray-500 cursor-pointer hover:text-red-500"
        />
      </div>
      <h3 className="pb-2 text-base font-medium text-gray-800">Notification</h3>
      <p className="text-base text-gray-800">{message}</p>
      <div className="pt-6">
        <p className="text-xs text-gray-600">
          Auto close in <span className="text-red-500">{timer}</span> seconds
        </p>
      </div>
    </div>
  );
};

export default ToastNotification;