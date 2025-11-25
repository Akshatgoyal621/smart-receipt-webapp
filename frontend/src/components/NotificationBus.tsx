import React, {createContext, useContext, useState, ReactNode} from "react";

interface NotifyPayload {
  title: string;
  message: string;
}

interface NotificationContextType {
  notify: (payload: NotifyPayload) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotify = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotify must be used inside <NotificationProvider>");
  return ctx.notify;
};

export function NotificationProvider({children}: {children: ReactNode}) {
  const [notification, setNotification] = useState<NotifyPayload | null>(null);

  const notify = (payload: NotifyPayload) => {
    setNotification(payload);
    setTimeout(() => setNotification(null), 3000); // will hide it in 3 sec
  };

  return (
    <NotificationContext.Provider value={{notify}}>
      {children}

      {notification && (
        <div className="fixed top-5 right-5 bg-white shadow-lg border border-slate-200 rounded-xl p-4 max-w-sm w-full animate-fadeIn z-[9999]">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <span className="w-3 h-3 bg-brand-500 rounded-full inline-block"></span>
            </div>

            <div className="flex-1">
              <div className="font-semibold text-slate-800 break-words">
                {notification.title}
              </div>

              <div className="text-sm text-slate-600 mt-1 break-words leading-relaxed">
                {notification.message}
              </div>
            </div>

            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
