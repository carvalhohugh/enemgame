import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="content-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'auto' }}>
                <Header />
                <main className="main-content" style={{ padding: '0 20px 20px 20px' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;

