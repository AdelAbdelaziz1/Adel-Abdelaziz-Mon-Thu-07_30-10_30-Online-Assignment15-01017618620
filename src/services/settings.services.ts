import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface ChangePasswordPayload {
  password: string;
  newPassword: string;
}

export async function changePassword(payload: ChangePasswordPayload) {
  return axios.patch(`${BASE_URL}/users/change-password`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("userToken")}`,
    },
  });
}