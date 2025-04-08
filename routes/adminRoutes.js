import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Settings from "./Settings/Settings";
import ProfileSettings from "./Settings/ProfileSettings";
import PasswordSettings from "./Settings/PasswordSettings";
import BusinessSettings from "./Settings/BusinessSettings";
import UserManagement from "./Settings/UserManagementSettings";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/settings" element={<Settings />} />
      <Route path="/admin/settings/profile" element={<ProfileSettings />} />
      <Route path="/admin/settings/password" element={<PasswordSettings />} />
      <Route path="/admin/settings/business" element={<BusinessSettings />} />
      <Route path="/admin/settings/users" element={<UserManagement />} />
    </Routes>
  );
}

export default AdminRoutes;
