import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/Forgot-password";

import AdminDashboard from "./pages/admin/Admin-dashboard";
import UserDashboard from "./pages/user/User-dashboard";

import Dashboard from "./pages/admin/Dashboard";
import LostItems from "./pages/admin/Lost-item";
import FoundItems from "./pages/admin/Found-item";
import ClaimedItems from "./pages/admin/Claimed-item";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import ClaimRequest from "./pages/admin/Claim-request";

// User pages
import Home from "./pages/user/Home";
import UserFoundItems from "./pages/user/Found-item";
import UserLostItems from "./pages/user/Lost-item";
import UserClaimedItems from "./pages/user/Claimed-item";
import UserMyItems from "./pages/user/My-items";
import UserProfile from "./pages/user/Profile";
import UserUserGuide from "./pages/user/User-guide";
import MyClaims from "./pages/user/My-claims";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Admin Dashboard */}
                <Route
                    path="/adminDashboard"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="lost-items" element={<LostItems />} />
                    <Route path="found-items" element={<FoundItems />} />
                    <Route path="claimed-items" element={<ClaimedItems />} />
                    <Route path="users" element={<Users />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="claim-requests" element={<ClaimRequest />} />
                </Route>

                {/* User Dashboard */}
                <Route
                    path="/userDashboard"
                    element={
                        <ProtectedRoute role="resident">
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Home />} />
                    <Route path="user-lost-items" element={<UserLostItems />} />
                    <Route path="user-found-items" element={<UserFoundItems />} />
                    <Route path="user-claimed-items" element={<UserClaimedItems />} />
                    <Route path="user-my-items" element={<UserMyItems />} />
                    <Route path="user-profile" element={<UserProfile />} />
                    <Route path="user-guide" element={<UserUserGuide />} />
                    <Route path="user-my-claims" element={<MyClaims />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;