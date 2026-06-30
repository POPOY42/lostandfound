import { BrowserRouter, Route, Routes } from "react-router-dom"


import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import AdminDashboard from "./pages/admin/Admin-dashboard"
import StudentDashboard from "./pages/student/Student-dashboard"

import Dashboard from "./pages/admin/Dashboard"
import LostItems from "./pages/admin/Lost-item"
import FoundItems from "./pages/admin/Found-item"
import ClaimedItems from "./pages/admin/Claimed-item"
import Users from "./pages/admin/Users"
import Settings from "./pages/admin/Settings"
import ClaimRequest from "./pages/admin/Claim-request"

const App = () =>{
    return(
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login/>}></Route>
                    <Route path="/register" element={<Register/>}></Route>

                    <Route path="/adminDashboard" element={<AdminDashboard/>}>
                        <Route index element={<Dashboard />} />
                        <Route path="lost-items" element={<LostItems />} />
                        <Route path="found-items" element={<FoundItems />} />
                        <Route path="claimed-items" element={<ClaimedItems />} />
                        <Route path="users" element={<Users />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="claim-requests" element={<ClaimRequest />} />
                    </Route>
                    <Route path="/studentDashboard" element={<StudentDashboard/>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App