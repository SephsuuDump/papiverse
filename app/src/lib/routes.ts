import { BookMarked, ChartNoAxesCombined, Container, Ham, Megaphone, MessageCircleMore, Store, UserRound, UsersRound, Wallet } from "lucide-react";

export const adminRoute = [
    { 
        title: 'Announcements', 
        icon: Megaphone,
        href: '/announcements',
        children: []
    },
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
            // { title: 'Paid Orders', href: '/sales/paid-orders' },
            { title: 'Branch Sales', href: '/sales/branches' },
        ]
    },
    { 
        title: 'Messages', 
        icon: MessageCircleMore,
        href: '/messages',
        children: []
    },
    { 
        title: 'Catalog', 
        icon: BookMarked,
        children: [
            { title: 'Supplies', href: '/supplies' },
            { title: 'Products', href: '/products' },
        ]
    },
    
    
]

export const franchiseeRoute = [
    { 
        title: 'Announcements', 
        icon: Megaphone,
        href: '/announcements',
        children: []
    },
    { 
        title: 'Employees', 
        icon: UsersRound,
        href: '/employees',
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
        title: 'Sales', 
        icon: ChartNoAxesCombined,
        children: [
            { title: 'Paid Orders', href: '/sales/paid-orders' },
        ]
    },
    { 
        title: 'Expenses', 
        icon: Wallet,
        href: '/expenses',
        children: []
    },
    { 
        title: 'Messages', 
        icon: MessageCircleMore,
        href: '/messages',
        children: []
    },
    { 
        title: 'Catalog', 
        icon: BookMarked,
        children: [
            { title: 'Supplies', href: '/supplies' },
            { title: 'Products', href: '/products' },
        ]
    },
]