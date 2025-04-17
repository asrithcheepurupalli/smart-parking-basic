import { useState, useEffect } from 'react';

export function useNotifications() {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Simulate real-time notifications
    const timer = setInterval(() => {
      const randomNotifications = [
        "🎉 Special 20% off on beach road parking!",
        "⚡ High demand near CMR Central. Book early!",
        "🎯 New smart parking spots added in Dwaraka Nagar",
        "💫 Congratulations! You've earned 100 ParkCoins",
        "🚗 Your favorite spot is available at Jagadamba Junction"
      ];

      if (notifications.length < 3 && Math.random() > 0.7) {
        setNotifications(prev => [
          ...prev,
          randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        ]);
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [notifications]);

  const clearNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  return { notifications, clearNotification };
}