import { NavLink, Link, Outlet } from "react-router-dom";

import { AppContext } from "../AppContext";
import { useContext } from "react";

export function MainLayout() {

    const { username } = useContext(AppContext)

    return (
        <div className="main-layout-container row">
            <div className="col-10 pe-0">
                <div className="top-bar rtl d-flex align-items-center px-3 text-white">
                    מחובר כ-{<span className="fw-bold">{username}</span>}
                </div>
                <Outlet />
            </div>
            <div className="main-dashboard col-2 vh-100 text-white">
                <nav className="main-dashboard-nav">
                    <h3 className="sidebar-header">מערכת אישורים</h3>
                    <hr></hr>
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