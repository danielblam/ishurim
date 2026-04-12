import { NavLink, Link, Outlet } from "react-router-dom";

export function MainLayout() {
    return (
        <div className="main-layout-container row">
            <div className="col-10 pe-0">
                <div className="top-bar bg-secondary">
                    things to put here: logged in as (user), extra buttons, etc.
                </div>
                <Outlet />
            </div>
            <div className="main-dashboard col-2 vh-100 bg-dark text-white">
                <nav className="main-dashboard-nav">
                    <h2>תפריט ראשי</h2>
                    <div><NavLink to="/dash/approvals?create=true">
                        אישור חדש
                    </NavLink></div>
                    <div><NavLink to="/dash/approvals?create=false" className={({ isActive }) => isActive ? "current-page" : ""}>
                        רשימת אישורים
                    </NavLink></div>
                    <div><NavLink to="/dash/approvers" className={({ isActive }) => isActive ? "current-page" : ""}>
                        רשימת מאשרים
                    </NavLink></div>
                    <div><NavLink to="/dash/tests" className={({ isActive }) => isActive ? "current-page" : ""}>
                        סוגי בדיקות
                    </NavLink></div>
                    <div><NavLink to="/dash/vehicles" className={({ isActive }) => isActive ? "current-page" : ""}>
                        כלי תחבורה
                    </NavLink></div>
                    <div><NavLink to="/dash/institutes" className={({ isActive }) => isActive ? "current-page" : ""}>
                        מכונים
                    </NavLink></div>
                    <div><NavLink to="/dash/hospitals" className={({ isActive }) => isActive ? "current-page" : ""}>
                        בתי חולים
                    </NavLink></div>
                </nav>
            </div>
        </div>
    )
}