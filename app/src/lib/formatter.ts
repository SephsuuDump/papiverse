import { InventoryLog } from "@/types/inventory-log";

export function formatToPeso(amount: number): string {
    const formatted = amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `₱${formatted}`;
}

export function formatDateToWords(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
}

export function formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    
    const optionsDate: Intl.DateTimeFormatOptions = {
        month: 'long',    // full month name, e.g. March
        day: 'numeric',   // numeric day, e.g. 30
        year: 'numeric',  // full year, e.g. 2024
    };

    // Format date part: "March 30, 2024"
    const formattedDate = date.toLocaleDateString('en-US', optionsDate);

    // Format time part: e.g. "4:09AM"
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert 24h to 12h
    hours = hours % 12;
    if (hours === 0) hours = 12; // midnight or noon

    // Pad minutes with leading zero if needed
    const minutesStr = minutes.toString().padStart(2, '0');

    const formattedTime = `${hours}:${minutesStr}${ampm}`;

    return `${formattedDate} ${formattedTime}`;
}


export function getWeekday(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

export function capitalizeWords(str: string): string {
    if (!str) return '';
    return str
        .split(' ')               
        .map(word =>                   
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() 
        )
        .join(' ');                   
}

export function flattenGroupedLogsWithOrders(
        groupedLogsByDateOrder: Record<string, Record<string, InventoryLog[]>>
    ): { date: string; orders: { orderId: string | null; logs: InventoryLog[] }[] }[] {
    const result: { date: string; orders: { orderId: string | null; logs: InventoryLog[] }[] }[] = [];

    const sortedDates = Object.keys(groupedLogsByDateOrder).sort((a, b) => (a < b ? 1 : -1));

    for (const date of sortedDates) {
        const orders = groupedLogsByDateOrder[date];
        const ordersList: { orderId: string | null; logs: InventoryLog[] }[] = [];

        const sortedOrderKeys = Object.keys(orders).sort((a, b) => {
            const aNum = Number(a);
            const bNum = Number(b);
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return bNum - aNum; 
            }
            return a < b ? 1 : -1;
        });

        for (const orderId of sortedOrderKeys) {
            const parsedOrderId = orderId === "null" ? null : orderId;
            ordersList.push({ orderId: parsedOrderId, logs: orders[orderId] });
        }

        result.push({ date, orders: ordersList });
    }
    return result;
}


export const fromatMessageDateTime = (messageDateTime: string): string => {
    const now = new Date();
    let date: Date;

    // Try to parse messageDateTime if it contains "Today" or exact time only
    // Otherwise, parse it as a Date object if possible
    if (messageDateTime.startsWith("Today")) {
        // Format: "Today 2:30 PM" => show time only
        const parts = messageDateTime.split(" ");
        return parts.slice(1, 3).join(" ");
    } else if (/^\d{1,2}:\d{2} (AM|PM)$/.test(messageDateTime)) {
        // Already a time string, return as is
        return messageDateTime;
    } else if (/^[A-Za-z]{3} \d{1,2}$/.test(messageDateTime)) {
        // Date string "Jul 10" - already date format, return as is
        return messageDateTime;
    } else if (/^[A-Za-z]{3}$/.test(messageDateTime)) {
        // Just day name, return as is
        return messageDateTime;
    } else {
        // Try parsing date strings like "Jul 10", "Mon 3:20 PM", or "Yesterday"
        if (messageDateTime.startsWith("Yesterday")) {
        date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toLocaleDateString("en-US", { weekday: "short" }); // e.g. "Tue"
        } else if (/^[A-Za-z]{3} \d{1,2} \d{1,2}:\d{2} (AM|PM)$/.test(messageDateTime)) {
        // "Jul 10 5:00 PM"
        const [monthDay] = messageDateTime.split(" ");
        return monthDay; // Just date only "Jul 10"
        } else if (/^[A-Za-z]{3} \d{1,2}$/.test(messageDateTime)) {
        return messageDateTime; // already date only
        } else if (/^[A-Za-z]{3} \d{1,2} \d{4}$/.test(messageDateTime)) {
        // "Jul 10 2023" - just return "Jul 10"
        return messageDateTime.split(" ").slice(0, 2).join(" ");
        } else if (/^[A-Za-z]{3}$/.test(messageDateTime)) {
        return messageDateTime; // day name
        }
    }

    // If original messageDateTime is a valid date string:
    date = new Date(messageDateTime);
    if (isNaN(date.getTime())) {
        // If date is invalid, just return original string
        return messageDateTime;
    }

    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // difference in days

    if (diffDays === 0) {
        // Today - show time like "2:30 PM"
        return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } else if (diffDays === 1) {
        // Yesterday - show day name, e.g. "Tue"
        return date.toLocaleDateString("en-US", { weekday: "short" });
    } else if (diffDays > 7) {
        // More than 1 week old - show date "Jul 10"
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } else {
        // Between 2 and 7 days old - show day name e.g. "Mon"
        return date.toLocaleDateString("en-US", { weekday: "short" });
    }
};

export function displayCurrentDate() {
    const d = new Date();

    const weekday = d.toLocaleString("en-US", { weekday: "long" });
    const month = d.toLocaleString("en-US", { month: "long" });
    const day = d.getDate();
    const year = d.getFullYear();

    return `${weekday}, ${month} ${day}, ${year}`;
}
