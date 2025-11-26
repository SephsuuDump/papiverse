"use client";

import { useState } from "react";
import { BellRing, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Claim } from "@/types/claims";
import { SectionLoading } from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth";
import { useToday } from "@/hooks/use-today";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import useNotifications from "@/hooks/use-notification";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationSheet } from "@/components/shared/NotificationSheet";

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function EventsCalendar() {
    const today = new Date();
    const todayFormatted = new Date().toISOString().split("T")[0];
    const isMobile = useIsMobile();

    const { claims, loading } = useAuth();
    const { filteredNotifications, loading: notifLoading } = useNotifications({claims, type: "ANNOUNCEMENT"}); 
    const { monthShort, dayLong, day } = useToday();

    const [showNotif, setShowNotif] =  useState(false);
    const [selectedDay, setSelectedDay] = useState(todayFormatted);
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const emptyDays = Array.from({ length: firstDay });
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handlePrev = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNext = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const toYMD = (y: number, m: number, d: number) => {
        return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    };

    if (loading || notifLoading) return <SectionLoading />
    return (
        <ScrollArea className="space-y-2 h-[95vh]">
            <div className="flex-center-y justify-between">
                <div className="flex-center-y gap-1 text-lg font-bold">Events Calendar</div>
                <Button 
                    onClick={ () => setShowNotif?.(true) }
                    className="my-auto bg-light shadow-sm border-1 hover:bg-slate-200"
                    size="sm"
                >   
                    <BellRing className="text-dark" />
                    {filteredNotifications.length > 0 && (
                        <Badge className="bg-darkred">{ filteredNotifications.length }</Badge>
                    )}
                    
                </Button>
            </div>

            <div className="bg-slate-50 my-2 p-2 rounded-md shadow-sm">
                
                {/* HEADER */}
                <div className="flex justify-between items-center p-2">
                    <button onClick={handlePrev} className="p-2 hover:bg-gray-100 rounded transition">
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <h2 className="font-semibold text-sm">
                        {monthNames[currentMonth]} {currentYear}
                    </h2>

                    <button onClick={handleNext} className="p-2 hover:bg-gray-100 rounded transition">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* WEEKDAY HEADER */}
                <div className="grid grid-cols-7 text-center font-medium text-gray-600">
                    {weekDays.map((day) => (
                        <div key={day} className="py-1 text-xs">
                            {day}
                        </div>
                    ))}
                </div>

                {/* CALENDAR GRID */}
                <div className="grid grid-cols-7 text-center">

                    {/* Empty placeholders */}
                    {emptyDays.map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {/* Days */}
                    {days.map((day) => {
                        const dateStr = toYMD(currentYear, currentMonth, day);

                        const isToday =
                            day === today.getDate() &&
                            currentMonth === today.getMonth() &&
                            currentYear === today.getFullYear();

                        const isSelected = selectedDay === dateStr;

                        const dayOfWeek = (firstDay + day - 1) % 7;
                        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                        return (
                            <div
                                key={day}
                                onClick={() => setSelectedDay(dateStr)}
                                className={`
                                    cursor-pointer aspect-square rounded-full transition my-1 flex-center
                                    ${isSelected ? "bg-darkbrown text-white font-bold" : ""}
                                    ${!isSelected && isToday ? "bg-green-100 font-bold" : ""}
                                    ${!isSelected && !isToday ? "bg-slate-100 hover:bg-orange-100" : ""}
                                    ${isWeekend && !isSelected ? "text-darkred" : ""}
                                `}
                            >
                            
                            <div className="text-sm text-center font-bold">
                                {String(day)}
                            </div>
                             
                            
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-slate-50 flex-center-y gap-4 rounded-md shadow-sm py-2">
                <div className="flex-center-y flex-col border-r-1 px-4">
                    <div className="font-extrabold uppercase text-sm">{ monthShort }</div>
                    <div className="text-xl font-extrabold">{ day }</div>
                </div>
                <div className="font-semibold uppercase scale-x-110 origin-left">{ dayLong }</div>
            </div>

            <div className="flex-center flex-col h-50 bg-slate-50 rounded-md shadow-sm">
                <Calendar className="w-20 h-20 text-gray" />
                <div className="text-gray">Events Coming Soon</div>
            </div>

            {showNotif && (
                <NotificationSheet
                    notifications={ filteredNotifications }
                    setOpen={ setShowNotif }
                />
            )}
        </ScrollArea>
    );
}
