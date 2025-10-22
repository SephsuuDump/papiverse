import { ChartNoAxesCombined, Container, Ham, Megaphone, MessageCircleMore, Store, UserRound, UsersRound, Wallet } from "lucide-react";

export const adminRoute = [
    { 
        title: 'Users', 
        icon: UserRound,
        href: '/users',
        children: []
    },
    { 
        title: 'Branches', 
        icon: Store,
        href: '/branches',
        children: []
    },
    { 
        title: 'Messages', 
        icon: MessageCircleMore,
        href: '/admin/messages',
        children: []
    },
    { 
        title: 'Announcement', 
        icon: Megaphone,
        href: '/announcements',
        children: []
    },
    { 
        title: 'Supplies', 
        icon: Ham,
        href: '/supplies',
        children: []
    },
    { 
        title: 'Inventory', 
        icon: Container,
        children: [
            { title: 'Inventories', href: '/inventory/inventories' },
            { title: 'Inventory Logs', href: '/inventory/logs' },
            { title: 'Supply Orders', href: '/inventory/supply-orders' },
        ]
    },
    { 
        title: 'Sales', 
        icon: ChartNoAxesCombined,
        children: [
            { title: 'Overview', href: '/sales' },
            { title: 'Products', href: '/sales/products' },
            { title: 'Paid Orders', href: '/sales/paid-orders' },
            { title: 'Branch Sales', href: '/admin/sales/branches' },
        ]
    },
]

export const franchiseeRoute = [
    { 
        title: 'Employees', 
        icon: UsersRound,
        href: '/employees',
        children: []
    },
    { 
        title: 'Expenses', 
        icon: Wallet,
        href: '/expenses',
        children: []
    },
    { 
        title: 'Inventory', 
        icon: Container,
        children: [
            { title: 'Overview', href: '/franchisee/inventory' },
            { title: 'Inventories', href: '/inventory/inventories' },
            { title: 'My Supply Orders', href: '/inventory/supply-orders/' },
            { title: 'Inventory Logs', href: '/inventory/logs' },
        ]
    },
     { 
        title: 'Messages', 
        icon: MessageCircleMore,
        children: [
            { title: 'Users', href: '/admin/messages/' },
            { title: 'Group', href: '/admin/messages/' },
        ]
    },
]