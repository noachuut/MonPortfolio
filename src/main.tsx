import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// PrimeReact theme & core styles
// PrimeReact styles were temporarily added; reverted to app styles only

createRoot(document.getElementById("root")!).render(<App />);
