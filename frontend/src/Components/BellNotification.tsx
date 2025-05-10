import React, { useState, useEffect } from 'react';
import "../style/BellNotification.css";

type Notification = {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const BellNotification: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const employeeId = localStorage.getItem("employeeId");
      if (!employeeId) {
        console.warn("No employee ID found in localStorage");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5122/api/employee/notifications?employeeId=${employeeId}`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications]);

  return (
    <div className="notification-container">
      <button className="bell-icon" onClick={handleBellClick}>
        🔔
      </button>
      {showNotifications && (
        <div className="notifications-dropdown">
          <ul>
            {notifications.length === 0 ? (
              <li>No notifications</li>
            ) : (
              notifications.map((notification) => (
                <li key={notification.id}>
                  <div className="notification-text">{notification.message}</div>
                  <small>{new Date(notification.createdAt).toLocaleString()}</small>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BellNotification;
