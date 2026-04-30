export function FailedWindowsLogin() {
    return (
        <div className="login-page-container fs-5 bg-light">
            <div className="login-container shadow-lg bg-white">
                <div className="text-danger rtl">אין לך גישה למערכת הזאת.</div>
                {/* i was asked to make this a seperate page */}
            </div>
        </div>
    )
}