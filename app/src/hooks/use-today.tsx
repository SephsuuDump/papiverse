"use client";

import { useMemo } from "react";

export function useToday() {
    // Generate today's date only once (memoized)
    const today = useMemo(() => new Date(), []);

    // Day of the month, always 2 digits (e.g., "08")
    const day = String(today.getDate()).padStart(2, "0");

    // Numeric month, always 2 digits (e.g., "11")
    const monthNumber = String(today.getMonth() + 1).padStart(2, "0");

    // Full year (e.g., 2025)
    const year = today.getFullYear();

    // Short month name (e.g., "Nov")
    const monthShort = today.toLocaleString("en-US", { month: "short" });

    // Full month name (e.g., "November")
    const monthLong = today.toLocaleString("en-US", { month: "long" });

    // Short day of the week (e.g., "Tue")
    const dayShort = today.toLocaleString("en-US", { weekday: "short" });

    // Full day of the week (e.g., "Tuesday")
    const dayLong = today.toLocaleString("en-US", { weekday: "long" });

    return {
        dateObj: today,   // Raw Date object for flexibility
        day,              // "08"
        monthNumber,      // "11"
        year,             // 2025
        monthShort,       // "Nov"
        monthLong,        // "November"
        dayShort,         // "Tue"
        dayLong,          // "Tuesday"
    };
}
