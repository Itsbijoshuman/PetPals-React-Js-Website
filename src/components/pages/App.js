import { BrowserRouter } from "react-router-dom";
import NavBar from "../NavBar";
import Pages from "./Pages";
import AuthProvider from "../../context/auth";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<NavBar />
				<Pages />
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
