import React, { useState } from 'react'
import Navbar from "@/components/Navbar"
import Sidebar from '@/components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function PrivateLayout() {
   const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
     <>
        <div className="h-screen flex flex-col">

      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 pt-[72px]">
       
        <div className="hidden md:block w-60 fixed top-[57px] left-0 h-[calc(100vh-57px)] z-30">
          <Sidebar />
        </div>

     
        {sidebarOpen && (
          <div className="fixed inset-0 z-40  bg-opacity-40 md:hidden" onClick={() => setSidebarOpen(false)}>
            <div
              className="w-20 bg-white h-full pt-12 shadow-md transform transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        <main className="flex-1 md:ml-60 p-4 overflow-auto">  <Outlet /></main>
      </div>
    </div>
    </>
  )
}

