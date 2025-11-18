// src/components/Sidebar.jsx
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarLogo,          // ← this one was missing / renamed
} from 'flowbite-react'

import {
  HiChartPie,
  HiShoppingBag,
  HiTruck,
  HiUserGroup,
  HiShoppingCart,
  HiCurrencyDollar,
} from 'react-icons/hi'

import { Link, useLocation } from 'react-router-dom'

export default function AppSidebar() {
  const location = useLocation()

  const menu = [
    { name: 'Dashboard',   path: '/',          icon: HiChartPie },
    { name: 'Inventory',   path: '/inventory', icon: HiShoppingBag },
    { name: 'Suppliers',   path: '/suppliers', icon: HiTruck },
    { name: 'Customers',   path: '/customers', icon: HiUserGroup },
    { name: 'Purchases',   path: '/purchases', icon: HiShoppingCart },
    { name: 'Sales',       path: '/sales',     icon: HiCurrencyDollar },
  ]

  return (
    <Sidebar className="fixed inset-y-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200">
      {/* Logo */}
      <SidebarLogo href="/" className="px-6 py-5 border-b border-gray-200">
        <span className="text-2xl font-bold text-purple-600">Inventory Pro</span>
      </SidebarLogo>

      {/* Menu Items */}
      <SidebarItems className="mt-6">
        <SidebarItemGroup>
          {menu.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <SidebarItem
                key={item.name}
                as={Link}
                to={item.path}
                active={isActive}
                icon={Icon}
                className={isActive ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-600' : 'hover:bg-gray-50'}
              >
                {item.name}
              </SidebarItem>
            )
          })}
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}