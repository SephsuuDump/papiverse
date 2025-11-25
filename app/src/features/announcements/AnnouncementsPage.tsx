"use client"

import { useFetchData } from "@/hooks/use-fetch-data";
import { AnnouncementService } from "@/services/announcement.service";
import { Announcement } from "@/types/announcement";
import { AnnouncementImages } from "./components/AnnouncementImages";
import { formatCustomDate } from "@/lib/formatter";
import { AppHeader } from "@/components/shared/AppHeader";
import { AppAvatar } from "@/components/shared/AppAvatar";
import { useCrudState } from "@/hooks/use-crud-state";
import { Button } from "@/components/ui/button";
import { CreateAnnouncement } from "./components/CreateAnnouncement";
import { useAuth } from "@/hooks/use-auth";
import { PapiverseLoading } from "@/components/ui/loader";
import { useState } from "react";
import { AppRUDSelection } from "@/components/shared/AppRUDSelection";
import { ViewAnnouncement } from "./components/ViewAnnouncement";
import { Ellipsis } from "lucide-react";
import { DeleteAnnouncement } from "./components/DeleteAnnouncement";
import { NotificationSection } from "./components/NotificationSection";
import useNotifications from "@/hooks/use-notification";
import { toast } from "sonner";
import { NotificationResponse } from "@/types/notification";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventsCalendar } from "./components/EventsCalendar";

export function AnnouncementPage() {
    const [reload, setReload] = useState(false);

    const { claims, loading: authLoading } = useAuth();
    const { data: announcements, loading, error } = useFetchData<Announcement>(AnnouncementService.getAllAnnouncements, [reload], []);
    const { notifications, loading: notifLoading } = useNotifications({claims})
    const { toView, setView, open, setOpen, toDelete, setDelete } = useCrudState<Announcement>();
    
    if (loading || authLoading) return <PapiverseLoading />
    return (
        <section className="stack-md animate-fade-in-up">
            <AppHeader label="Announcements" />
            <div className="grid grid-cols-4">
                <ScrollArea className="col-span-3 stack-md h-[95vh]">
                    <div className="mx-auto space-y-2 w-full px-4 max-md:px-0">
                        {claims.roles[0] === 'FRANCHISOR' && (
                            <div className="flex-center-y gap-2 bg-slate-50 py-3 px-4 rounded-md shadow-sm">
                                <AppAvatar className="max-md:hidden" />
                                <Button 
                                    onClick={ () => setOpen(true) }
                                    className="justify-start flex-1 !bg-light h-8 text-gray shadow-sm rounded-full"
                                >
                                    Announce something to Papiverse
                                </Button>
                            </div>
                        )}
                        {announcements.map((item, index) => (
                            <div 
                                className="stack-md bg-light rounded-md shadow-sm p-4 animate-fade-in-up" key={ index }
                            >
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2 px-4">
                                        <AppAvatar fallback={ `${item.firstName![0]}${item.lastName![0]}` } />
                                        <div>
                                            <div className="font-semibold">{ `${item.firstName} ${item.lastName}` }</div>
                                            <div className="text-gray text-xs -mt-1">{ item.branchName }</div>
                                        </div>
                                    </div>
                                    {claims.roles[0] === 'FRANCHISOR' && (
                                        <AppRUDSelection
                                            item={ item }
                                            icon={Ellipsis}
                                            setDelete={ setDelete }
                                        />
                                    )}
                                </div>
                                <div className="px-4 text-sm">{ item.content }</div>
                                <div className="px-2">
                                    {item.announcementImages.length > 0 && (
                                        <AnnouncementImages     
                                            toView={ item } 
                                            setView={ setView }
                                        />
                                    )}
                                </div>
                                <div className="text-xs text-gray text-end">{ formatCustomDate(item.datePosted) }</div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <EventsCalendar />
            </div>
            

            {open && (
                <CreateAnnouncement 
                    setOpen={ setOpen } 
                    setReload={ setReload }
                />
            )}

            {toView && (
                <ViewAnnouncement 
                    toView={ toView! } 
                    setView={ setView }
                />
            )}

            {toDelete && (
                <DeleteAnnouncement
                    toDelete={ toDelete }
                    setDelete={ setDelete }
                    setReload={ setReload }
                />
            )}
        </section>
    )
}