import { Route, Routes } from "react-router-dom";
import OrderManagement from "./pages/OrderManagement";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<OrderManagement />} />
      <Route path="/orders/*" element={<OrderManagement />} />
    </Routes>
  );
import { Routes, Route } from "react-router-dom";
import TicketDashboard from "./features/tickets/TicketDashboard";
import TicketDetail from "./features/tickets/TicketDetail";

const App = () => {
	return (
		<>
			<Routes>
				<Route
					path="/tickets"
					element={<TicketDashboard className={"w-[75%]"} />}
				/>
				<Route path="/tickets/:id" element={<TicketDetail />} />{" "}
				
			</Routes>
		</>
	);
};

export default App;
