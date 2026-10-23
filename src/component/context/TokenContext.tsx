import React, { useState } from "react";
import { TokenContext } from "./TokenContext";

  
export default function TokenContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("userToken"),
  );
  return (
    <>
      <TokenContext.Provider value={{ token, setToken }}>
        {children}
      </TokenContext.Provider>
    </>
  );
}
