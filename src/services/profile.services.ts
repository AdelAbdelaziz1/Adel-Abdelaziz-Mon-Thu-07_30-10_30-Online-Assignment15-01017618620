import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
});

export async function getMyProfile() {
  return axios.get(`${BASE_URL}/users/profile-data`, {
    headers: authHeaders(),
  });
}

export async function getMyPosts(userId: string) {
  return axios.get(`${BASE_URL}/users/${userId}/posts`, {
    headers: authHeaders(),
  });
}

export async function getSavedPosts() {
  return axios.get(`${BASE_URL}/users/bookmarks`, {
    headers: authHeaders(),
  });
}

export async function toggleBookmark(postId: string) {
  return axios.put(
    `${BASE_URL}/posts/${postId}/bookmark`,
    {},
    { headers: authHeaders() }
  );
}