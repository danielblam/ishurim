import { Link, Outlet } from "react-router-dom";

export function MainLayout() {
    return (
        <div className="main-layout-container row">
            <div className="col-10 pe-0">
                <div className="top-bar bg-dark">
                    things to put here: logged in as (user), extra buttons, etc.
                </div>
                <Outlet/>
            </div>
            <div className="main-dashboard col-2 vh-100">
                <nav className="main-dashboard-nav">
                    <h1>תפריט ראשי</h1>
                    <div><Link to="/dash/approvals?create=true">אישור חדש</Link></div>
                    <div><Link to="/dash/approvals?create=false">רשימת אישורים</Link></div>
                    <div><Link to="/dash/approvers">רשימת מאשרים</Link></div>
                    <div><Link to="/dash/tests">סוגי בדיקות</Link></div>
                    <div><Link to="/dash/vehicles">כלי תחבורה</Link></div>
                    <div><Link to="/dash/institutes">מכונים</Link></div>
                    <div><Link to="/dash/hospitals">בתי חולים</Link></div>
                </nav>
            </div>
        </div>
    )
}