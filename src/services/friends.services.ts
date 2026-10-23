import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

export async function getSuggestedFriends(limit = 5) {
  return axios.get(`${BASE_URL}/users/suggestions`, {
    headers: authHeaders(),
    params: { limit },
  });
}

export async function toggleFollow(userId: string) {
  return axios.put(
    `${BASE_URL}/users/${userId}/follow`,
    {},
    { headers: authHeaders() },
  );
}