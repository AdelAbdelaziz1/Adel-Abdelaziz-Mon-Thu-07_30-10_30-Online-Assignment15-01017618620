import React, { createContext, useEffect, useState } from "react";
import type { userProfileType } from "../../types/user.types";
import { getMyProfile } from "../../services/profile.services";
import { useTokenContext } from "./TokenContext";

export type UserContextType = {
  userDetails: userProfileType | null;
  setUserDetails: React.Dispatch<React.SetStateAction<userProfileType | null>>;
};

export const UserContext = createContext<UserContextType | null>(null);

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useTokenContext();

  const [userDetails, setUserDetails] = useState<userProfileType | null>(null);

  async function getUserProfile() {
    try {
      const { data } = await getMyProfile();
      setUserDetails(data.data.user);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
if(token) {
    getUserProfile();
}

  }, [token]);
  return (
    <>
      <UserContext.Provider value={{ userDetails, setUserDetails }}>
        {children}
      </UserContext.Provider>
    </>
  );
}
