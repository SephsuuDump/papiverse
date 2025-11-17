"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export function DateRangePicker({ startDate, setStartDate, endDate, setEndDate }: {
    startDate: string;
    setStartDate: (i: string) => void;
    endDate: string;
    setEndDate: (i: string) => void;
}) {
    const toYMD = (d: Date | undefined) =>
        d ? format(d, "yyyy-MM-dd") : "";

    const displayDate = (iso: string) =>
        iso ? format(new Date(iso), "PPP") : "Select date";

    return (
        <div className="flex gap-2">
            <div>
                <Label className="text-sm font-medium">Start Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-[180px] justify-between text-left font-normal",
                                !startDate && "text-muted-foreground"
                            )}
                        >
                            {displayDate(startDate)}
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="p-0">
                        <Calendar
                            mode="single"
                            selected={startDate ? new Date(startDate) : undefined}
                            onSelect={(date) => setStartDate(toYMD(date))}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div>
                <Label className="text-sm font-medium">End Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-[180px] justify-between text-left font-normal",
                                !endDate && "text-muted-foreground"
                            )}
                        >
                            {displayDate(endDate)}
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="p-0">
                        <Calendar
                            mode="single"
                            selected={endDate ? new Date(endDate) : undefined}
                            onSelect={(date) => setEndDate(toYMD(date))}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
