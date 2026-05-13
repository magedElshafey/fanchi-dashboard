import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import "./styles.css";
import "./i18n";
import { setupMockApi } from "./mocks/server";
import AuthProvider from "./store/AuthProvider";
import { router } from "./routes";
setupMockApi();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 20_000, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>

    <Toaster richColors position="top-right" />
  </QueryClientProvider>,
);
