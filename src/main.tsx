import { Toast } from "@heroui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Toast.Provider />
		<App />
	</StrictMode>,
);
