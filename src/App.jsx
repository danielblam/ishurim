import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthLayout } from './layouts/authlayout';
import { MainLayout } from './layouts/mainlayout';
import { LoginPage } from './pages/login';
import { ApprovalsPage } from './pages/approvals';
import { ApproversPage } from './pages/approvers';
import { HospitalsPage } from './pages/hospitals';
import { InstitutesPage } from './pages/institutes';
import { TestsPage } from './pages/tests';
import { VehiclesPage } from './pages/vehicles';
import { NewApproval } from './pages/newapproval';
import { AppProvider } from './AppContext';
import { DepartmentsPage } from './pages/departments';
import { FailedWindowsLogin } from './pages/failedwindowslogin';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<LoginPage />} />
            <Route path="/fail" element={<FailedWindowsLogin />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route path="/dash" element={<></>} />
            <Route path="/dash/newapproval" element={<NewApproval />} />
            <Route path="/dash/approvals" element={<ApprovalsPage />} />
            <Route path="/dash/approvers" element={<ApproversPage />} />
            <Route path="/dash/hospitals" element={<HospitalsPage />} />
            <Route path="/dash/institutes" element={<InstitutesPage />} />
            <Route path="/dash/tests" element={<TestsPage />} />
            <Route path="/dash/vehicles" element={<VehiclesPage />} />
            <Route path="/dash/departments" element={<DepartmentsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
