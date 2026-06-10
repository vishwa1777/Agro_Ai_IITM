import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import Dashboard from '@/pages/Dashboard';
import VisitTracking from '@/pages/VisitTracking';
import ProductDemand from '@/pages/ProductDemand';
import Reports from '@/pages/Reports';
import Profile from '@/pages/Profile';

const ManagerApp: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/visits" element={<VisitTracking />} />
        <Route path="/products" element={<ProductDemand />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default ManagerApp;
