"use client"

import { useAuth } from "@/hooks/use-auth"
import { redirect, usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarTrigger, useSidebar } from "../ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { adminRoute, franchiseeRoute } from "@/lib/routes";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronDown, ChevronsUpDown, CircleUserRound, LogOut, Menu } from "lucide-react";
import { AuthPage } from "@/features/auth/AuthPage";
import { AppAvatar } from "./AppAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Claim } from "@/types/claims";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { PapiverseLoading, SidebarLoading } from "../ui/loader";

export function AppSidebar() {
    const pathName = usePathname();
    const isMobile = useIsMobile();
    if (pathName === '/auth' || pathName === '/unauthorized') return null;

    const { claims, loading } = useAuth();
    const { open } = useSidebar();
    const [show, setShow] = useState(false);

    async function handleLogout() {
        await AuthService.deleteCookie();
        toast.success("Logging out. Please wait patiently.", { duration: Infinity });
        localStorage.removeItem('token');
        window.location.href = '/auth'
    }
    
    if (loading) return <SidebarLoading />
    if (!claims || !claims.roles || claims.roles.length === 0) redirect('/auth')
    
        
    const role = claims.roles[0];
    let route;

    if (role === "FRANCHISOR") route = adminRoute;
    else if (role === "FRANCHISEE") route = franchiseeRoute;
    else redirect("/unauthorized");

    if (isMobile) {
        return (
            <Sheet>
                <SheetTitle 
                    className="fixed top-0 z-50 bg-white rounded-md shadow w-full px-4 h-14 bg-cover bg-center"
                    style={{ backgroundImage: "url(/images/sidebar_bg.svg)" }}
                >
                    <div className="relative flex justify-end my-auto py-4">
                        <Link 
                            href="/"
                            className="mx-auto absolute top-0 left-1/2 -translate-x-1/2"
                        >
                            <Image
                                src="/images/papiverse_logo.png"
                                alt="Papiverse Logo"
                                width={120}
                                height={120}
                                className="mx-auto mt-4"
                            />
                        </Link>
                        <SheetTrigger className="h-full">
                            <Menu />
                        </SheetTrigger>
                    </div>
                </SheetTitle>

                <SheetContent 
                    side="left" 
                    className="p-0"
                >
                    <Sidebar collapsible="none">
                        <SidebarContent
                            className="bg-center bg-cover"
                            style={{ backgroundImage: "url(/images/sidebar_bg.svg)" }}
                        >
                            <Link href="/">
                                <Image
                                    src="/images/papiverse_logo.png"
                                    alt="Papiverse Logo"
                                    width={150}
                                    height={150}
                                    className="mx-auto mt-4"
                                />
                            </Link>

                            <SidebarMenu className="mt-4">
                            {route?.map((item, i) => (
                                item.children.length > 0 ? (
                                <Collapsible key={i}>
                                    <CollapsibleTrigger asChild>
                                    <SidebarMenuButton className="flex gap-2 pl-4">
                                        <item.icon className="w-4 h-4" />
                                        {item.title}
                                        <ChevronDown className="ml-auto" />
                                    </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.children.map((sub, index) => (
                                        <SidebarMenuButton key={index}>
                                            <Link href={sub.href} className="w-full h-full">
                                            {sub.title}
                                            </Link>
                                        </SidebarMenuButton>
                                        ))}
                                    </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                                ) : (
                                <SidebarMenuItem key={i}>
                                    <Link href={item.href!} className="w-full">
                                    <SidebarMenuButton className="flex gap-2 pl-4">
                                        <item.icon className="w-4 h-4" />
                                        {item.title}
                                    </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                                )
                            ))}
                            </SidebarMenu>
                            <SidebarFooter className="mt-auto mb-1">
                                <DropdownMenu open={show} onOpenChange={setShow}>
                                    <DropdownMenuTrigger asChild>
                                    <button 
                                        className={`flex-center-y gap-2 hover:bg-slate-50 rounded-md ${open && "p-1.5"}`}
                                    >
                                        <AppAvatar fallback="KP"/>
                                        <div>
                                        <div className="font-semibold">Username</div>
                                        <div className="text-xs -mt-0.5">{claims.roles[0]}</div>
                                        </div>
                                        <ChevronsUpDown className="ms-auto w-4 h-4" />
                                    </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent side="top" align="end" className="w-56">
                                        <div className="flex items-center gap-2 p-2">
                                            <AppAvatar fallback="KP"/>
                                            <div>
                                            <div className="font-semibold">Username</div>
                                            <div className="text-xs text-muted-foreground">{claims.roles[0]}</div>
                                            </div>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <button 
                                            className="w-full flex-center-y gap-2 text-sm px-3 py-1.5 hover:bg-slate-50 hover:rounded-md hover:text-gray"
                                        >
                                            <CircleUserRound className="w-4 h-4"/>My Account
                                        </button>
                                        <button 
                                            onClick={ () => handleLogout() }
                                            className="w-full flex-center-y gap-2 text-sm px-3 py-1.5 hover:bg-slate-50 hover:rounded-md hover:text-darkred"
                                        >
                                            <LogOut className="w-4 h-4"/>Logout
                                        </button>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarFooter>
                        </SidebarContent>
                    </Sidebar>
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <>
            <Sidebar
                variant="floating"
                collapsible="icon"
            >
                <SidebarTrigger 
                    className="rounded-full shadow-6xl bg-white absolute z-50 right-[-20px] top-[47%] -translate-x-1/2 -translate-y-1/2"
                />
                <SidebarContent 
                    className={`h-screen rounded-md bg-cover overflow-x-hidden`}
                    style={{ backgroundImage: "url(/images/sidebar_bg.svg)" }}
                >
                    <Link href="/">
                        <Image
                            src="/images/papiverse_logo.png"
                            alt="Papiverse Logo"
                            width={150}
                            height={150}
                            className="mx-auto mt-4"
                        />
                    </Link>
                    <SidebarMenu className={`mt-4 ${!open && "flex-center"}`}>
                        {route?.map((item, i) => (
                            item.children.length !== 0 ?
                            <Collapsible className="group/collapsible" key={ i }>
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton className="flex gap-2 pl-4">
                                            <item.icon className="w-4 h-4" />
                                            { item.title }
                                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.children.map((sub, index) => (
                                                <SidebarMenuButton className="py-0" key={ index }>
                                                    <Link 
                                                        href={ sub.href } 
                                                        className="flex-center-y w-full h-full my-auto"
                                                    >
                                                        { sub.title }
                                                    </Link>
                                                </SidebarMenuButton>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                            :
                            <Link 
                                href={ item.href! } 
                                className={`group/collapsible w-full hover:bg-slate-50 rounded-md ${!open && 'flex-center'}`} 
                                key={ i }
                            >
                                <SidebarMenuItem>
                                    <SidebarMenuButton className="flex gap-2 pl-4">
                                        <item.icon className="w-4 h-4" />
                                        { item.title }
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </Link>
                        ))}
                    </SidebarMenu>

                    <SidebarFooter className="mt-auto mb-1">
                        <DropdownMenu open={show} onOpenChange={setShow}>
                            <DropdownMenuTrigger asChild>
                            <button 
                                className={`flex-center-y gap-2 hover:bg-slate-50 rounded-md ${open && "p-1.5"}`}
                            >
                                <AppAvatar fallback="KP"/>
                                <div>
                                <div className="font-semibold">Username</div>
                                <div className="text-xs -mt-0.5">{claims.roles[0]}</div>
                                </div>
                                <ChevronsUpDown className="ms-auto w-4 h-4" />
                            </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent side="right" align="end" className="w-56">
                                <div className="flex items-center gap-2 p-2">
                                    <AppAvatar fallback="KP"/>
                                    <div>
                                    <div className="font-semibold">Username</div>
                                    <div className="text-xs text-muted-foreground">{claims.roles[0]}</div>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <button 
                                    className="w-full flex-center-y gap-2 text-sm px-3 py-1.5 hover:bg-slate-50 hover:rounded-md hover:text-gray"
                                >
                                    <CircleUserRound className="w-4 h-4"/>My Account
                                </button>
                                <button 
                                    onClick={ () => handleLogout() }
                                    className="w-full flex-center-y gap-2 text-sm px-3 py-1.5 hover:bg-slate-50 hover:rounded-md hover:text-darkred"
                                >
                                    <LogOut className="w-4 h-4"/>Logout
                                </button>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarFooter>
                </SidebarContent>
            </Sidebar>
            
        </>
    )
}

function DropdownFooter({ open, setShow, claims}: {
    open: boolean
    setShow: Dispatch<SetStateAction<boolean>>
    claims: Claim
}) {
    return (
        <DropdownMenu open onOpenChange={ setShow }>
            <DropdownMenuContent>
                <div className={`flex-center-y gap-2 hover:bg-slate-50 rounded-md ${open && "p-1.5"}`}>
                    <AppAvatar fallback="KP"/>
                    <div className="">
                        <div className="font-semibold">Username</div>
                        <div className="text-xs -mt-0.5">{ claims.roles[0] }</div>
                    </div>
                    <ChevronsUpDown className="ms-auto w-4 h-4" />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}