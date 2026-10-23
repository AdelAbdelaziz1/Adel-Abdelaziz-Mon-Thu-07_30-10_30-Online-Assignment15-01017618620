import axios from "axios";

const BASE_URL = "https://route-posts.routemisr.com";

function authHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  };
}

export async function getNotifications(page = 1, limit = 20) {
  const { data } = await axios.get(
    `${BASE_URL}/notifications?page=${page}&limit=${limit}`,
    authHeaders()
  );
  return data;
}

export async function getUnreadCount() {
  const { data } = await axios.get(
    `${BASE_URL}/notifications/unread-count`,
    authHeaders()
  );
  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { data } = await axios.patch(
    `${BASE_URL}/notifications/${notificationId}/read`,
    {},
    authHeaders()
  );
  return data;
}

export async function markAllNotificationsAsRead() {
  const { data } = await axios.patch(
    `${BASE_URL}/notifications/read-all`,
    {},
    authHeaders()
  );
  return data;
}