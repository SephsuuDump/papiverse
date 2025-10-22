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

export function AnnouncementPage() {
    const { data: announcements, loading, error } = useFetchData<Announcement>(AnnouncementService.getAllAnnouncements);
    const { open, setOpen } = useCrudState();
    
    return (
        <section className="stack-md animate-fade-in-up">
            <AppHeader label="Announcements" />
            <div className="mx-auto max-w-[720px] w-full px-4">
                <div className="flex-center-y gap-2 bg-slate-50 py-3 px-4 m-4 rounded-md shadow-sm">
                    <AppAvatar />
                    <Button 
                        onClick={ () => setOpen(true) }
                        className="justify-start flex-1 !bg-light h-8 text-gray shadow-sm rounded-full"
                    >
                        Announce something to Papiverse
                    </Button>
                </div>
                {announcements.map((item, index) => (
                    <div className="stack-md bg-light rounded-md shadow-sm m-4 p-4 animate-fade-in-up" key={ index }>
                        <div className="flex justify-between">
                            <div className="flex items-center gap-2 px-4">
                                <AppAvatar fallback={ `${item.firstName![0]}${item.lastName![0]}` } />
                                <div>
                                    <div className="font-semibold">{ `${item.firstName} ${item.lastName}` }</div>
                                    <div className="text-gray text-xs -mt-1">{ item.branchName }</div>
                                </div>
                            </div>
                            <div className="text-xs text-gray">{ formatCustomDate(item.datePosted) }</div>
                        </div>
                        <div className="px-4 text-sm">{ item.content }</div>
                        <div className="px-2">
                            {item.announcementImages.length > 0 && (
                                <AnnouncementImages images={ item.announcementImages } />
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {open && (
                <CreateAnnouncement setOpen={ setOpen } />
            )}
        </section>
    )
}