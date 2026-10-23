import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

export type TokenContextType = {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
};
export const TokenContext = createContext<TokenContextType | null>(null);

export function useTokenContext() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokenContext must be used within a TokenContextProvider");
  }
  return context;
}