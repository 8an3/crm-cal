import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider, } from "react-router-dom";
import Sales from './pages/sales'
import Service from "./pages/service";
import Technician from "./pages/technician";
import WorkOrder from "./pages/workOrder.calendar.$workOrderId";
import ClientSetter from "./pages/clientCalendar";
import Hours from "./pages/hours";
import EmployeeSched from "./pages/employeeSched";
import EmployeeUserSchedule from "./pages/employeeSchedSalespersonEmail";
import { Toaster } from "sonner";



const router = createBrowserRouter(
  createRoutesFromElements(
       <Route path='/' element={<Root />} >
               {/** sales */}
               <Route path='/calendar' element={<Sales />} />
               <Route path='/calendar/sales/clientsetter' element={<ClientSetter />} />
               <Route path='/calendar/sales/clientsetter/:salespersonEmail' element={<ClientSetter />} />
               {/** admin */}
               <Route path='/admin/calendar/hours' element={<Hours />} />
               <Route path='/admin/calendar/hours/employeeSched' element={<EmployeeSched />} />
               <Route path='/admin/calendar/hours/employeeSched/:salespersonEmail' element={<EmployeeUserSchedule />} />
               {/** service */}
               <Route path="/service/calendar" element={<Service />} />
               <Route path="/service/calendar/technician" element={<Technician />} />
               <Route path="/workOrder/calendar/:workOrderId" element={<WorkOrder />} />
    </Route>
  )
);
function Root() {
  return (
    <div className="min-h-screen flex flex-col">
      <Outlet />
        <Toaster richColors closeButton />
    </div>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);