import React, { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  PlusCircle,
  FileText,
  X,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
import AddNotification from "./AddNotification";
import api from "../Components/axios"; // ✅ Use configured api instance

const NotificationMain = ({ searchQuery }) => {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch Notifications from API
  const fetchNotifications = async () => {
    try {
      console.log("📊 Fetching notifications...");

      // ✅ Use 'api' instead of 'axios' - automatically sends cookies
      const { data } = await api.get("/api/notification/notifications");

      console.log("✅ Notifications received:", data);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("❌ Failed to fetch notifications:", error);
      // ❌ DO NOT redirect - just log the error
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter notifications based on search query
  const filteredNotifications = notifications.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.notificationTitle?.toLowerCase().includes(query) ||
      item.notificationDescription?.toLowerCase().includes(query)
    );
  });

  // Delete Notification
  const deleteNotification = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?"))
      return;

    try {
      console.log("🗑️ Deleting notification:", id);

      // ✅ Use 'api' instead of 'axios'
      await api.delete(`/api/notification/deleteNotification/${id}`);

      console.log("✅ Notification deleted successfully");
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error("❌ Failed to delete notification:", error);
      alert("Failed to delete notification. Please try again.");
    }
  };

  // Edit Notification
  const editNotification = (item) => {
    const mappedItem = {
      id: item.id,
      title: item.notificationTitle,
      date: item.notificationDate,
      description: item.notificationDescription,
      pdf: item.notificationPdf,
    };
    setEditData(mappedItem);
    setShowForm(true);
  };

  // Dynamic Counts
  const totalNotifications = notifications.length;
  const newNotifications = notifications.filter((n) => {
    const today = new Date().toISOString().split("T")[0];
    return n.notificationDate === today;
  }).length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Notifications */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">
              Total Notifications
            </p>
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <Bell className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {totalNotifications}
          </p>
        </div>

        {/* New Today */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-gray-200 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">New Today</p>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <BellRing className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {newNotifications}
          </p>
        </div>

        {/* Add Notification Button Card */}
        <button
          onClick={() => {
            setEditData(null);
            setShowForm(true);
          }}
          className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#891737] hover:bg-gray-50/50 transition-all text-left group"
        >
          <div className="flex items-start justify-between mb-3">
            <p className="text-sm font-medium text-gray-500 group-hover:text-[#891737] transition-colors">
              Add Notification
            </p>
            <div className="w-10 h-10 rounded-lg bg-[#891737] flex items-center justify-center group-hover:bg-[#891737]/90 transition-colors">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600">Create a new notification</p>
        </button>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <span className="text-xs font-medium text-gray-500">
            {filteredNotifications.length}{" "}
            {filteredNotifications.length === 1
              ? "notification"
              : "notifications"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  #
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Title
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Description
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Attachment
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                      No notifications found
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try adjusting your search or add a new notification
                    </p>
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-5 py-3.5 text-xs font-medium text-gray-900 whitespace-nowrap">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      <p
                        className="text-sm font-medium text-gray-900 truncate max-w-[200px]"
                        title={item.notificationTitle}
                      >
                        {item.notificationTitle}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-gray-600 line-clamp-2 max-w-xs">
                        {item.notificationDescription}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                      {item.notificationDate}
                    </td>
                    <td className="px-5 py-3.5">
                      {item.notificationPdf ? (
                        <a
                          href={item.notificationPdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="View PDF"
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => editNotification(item)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteNotification(item.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Notification Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <AddNotification
              editData={editData}
              onClose={() => {
                setShowForm(false);
                setEditData(null);
                fetchNotifications();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationMain;
