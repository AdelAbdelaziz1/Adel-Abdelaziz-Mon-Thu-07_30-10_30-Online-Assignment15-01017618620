import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import CounterContextProvider from "./component/context/CounterContext.tsx";
import TokenContextProvider from "./component/context/TokenContext.tsx";
import UserContextProvider from "./component/context/UserContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TokenContextProvider>
      <QueryClientProvider client= {queryClient} >
      <UserContextProvider>
        <CounterContextProvider>
          <App />
        </CounterContextProvider>
      </UserContextProvider>
      </QueryClientProvider>
    </TokenContextProvider>
  </StrictMode>,
);
