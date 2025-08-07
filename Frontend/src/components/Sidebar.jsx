import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Settings, ChevronDown, ChevronUp, FilePlus , User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
  { icon: <Home size={18} />, label: "Feed", path: "/" },
  { icon: <FilePlus size={18} />, label: "Create Post", path: "/create-post" },
  { icon: <User size={18} />, label: "My Profile", path: "/profile" },
  {
    icon: <Settings size={18} />,
    label: "Settings",
    submenu: [{ label: "Profile Edit", path: "/setting/profile" }],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-60 h-screen overflow-y-auto bg-white border-r p-4 pb-20"
    >
      <nav className="space-y-2">
        {sidebarItems.map((item, idx) => {
          const isActive = item.path && location.pathname === item.path;
          const isOpen = openMenus[item.label] || false;
          const isSubItemActive = item.submenu?.some((sub) =>
            location.pathname.startsWith(sub.path)
          );

          if (item.submenu) {
            return (
              <div key={idx}>
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={`w-full flex items-center justify-between px-2 py-2 rounded cursor-pointer hover:bg-gray-100 ${
                    isOpen || isSubItemActive ? "bg-gray-100" : ""
                  }`}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2 text-gray-800">
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="ml-6 overflow-hidden"
                    >
                      <ul className="space-y-1 mt-2">
                        {item.submenu.map((sub, subIdx) => (
                          <li key={subIdx}>
                            <Link
                              to={sub.path}
                              className={`block text-sm px-2 py-1 rounded hover:text-black hover:bg-gray-50 ${
                                location.pathname === sub.path
                                  ? "text-black font-medium bg-gray-100"
                                  : "text-gray-600"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center gap-2 px-2 py-2 rounded text-sm transition hover:bg-gray-100 ${
                isActive
                  ? "text-black font-medium bg-gray-100"
                  : "text-gray-700"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
