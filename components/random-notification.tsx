'use client';

import { users } from '@/lib';
import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';

export default function RandomNotification() {
  const [notification, setNotification] = useState(null);
  const [isExiting, setIsExiting] = useState(false);

  const getRandomUser = () =>
    users[Math.floor(Math.random() * users.length)];

  const closeNotification = () => {
    setIsExiting(true);
    setTimeout(() => {
      setNotification(null);
      setIsExiting(false);
    }, 300);
  };

  useEffect(() => {
    const showNotification = () => {
      const user = getRandomUser();
      setNotification({
        id: Date.now(),
        ...user,
      });

      setTimeout(() => {
        closeNotification();
      }, 8000);
    };

    showNotification(); 
    const interval = setInterval(showNotification, 12000);

    return () => clearInterval(interval);
  }, []);

  if (!notification) return null;

  return (
    <>
      <div className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 max-w-[calc(100vw-2rem)] sm:max-w-sm ${isExiting ? 'animate-toastOut' : 'animate-toastIn'}`}>
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">

          <div className="h-0.5 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />
          
          <div className="p-3">

            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <button
                onClick={closeNotification}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>


            <div className="flex items-start gap-2.5">
              <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center text-xl border border-slate-200 dark:border-slate-700">
                  {notification.avatar}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <p className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                    {notification.name}
                  </p>
                  <span className="text-[10px] text-slate-400">•</span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {notification.country}
                  </p>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  "{notification.comment}"
                </p>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </div>
                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Just signed up
                </span>
              </div>
              <span className="text-[9px] text-slate-400 dark:text-slate-500">
                via FolioSpace
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateX(100%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes toastOut {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(100%) scale(0.95);
          }
        }
        
        .animate-toastIn {
          animation: toastIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-toastOut {
          animation: toastOut 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}