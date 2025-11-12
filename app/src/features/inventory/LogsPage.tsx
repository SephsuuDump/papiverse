"use client"

import { PapiverseLoading } from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth";
import { InventoryLog } from "@/types/inventory-log";
import { useState } from "react";
import { OrderLogs } from "./components/OrderLogs";
import { InputLogs } from "./components/InputLogs";
import { InventoryService } from "@/services/inventory.service";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { AppHeader } from "@/components/shared/AppHeader";
import { usePagination } from "@/hooks/use-pagination";
import { TablePagination } from "@/components/shared/TablePagination";
import { TableFilter } from "@/components/shared/TableFilter";
import { Button } from "@/components/ui/button";
import { AppTabSwitcher } from "@/components/shared/AppTabSwitcher";
import { flattenGroupedLogsWithOrders } from "@/lib/formatter";

const tabs = ['Input Logs', 'Order Logs'];

export function LogsPage() {
    const [activeTab, setActiveTab] = useState('Input Logs');

    const { claims, loading: authLoading } = useAuth();
    const { data, loading, error } = useFetchData<InventoryLog>(
        InventoryService.getInventoryAudits,
        [claims.branch.branchId],
        [claims.branch.branchId],
    );
    const { search, setSearch, filteredItems } = useSearchFilter(data, ['dateTime', 'orderId']);
    const { page, setPage, size, setSize, paginated, totalPages } = usePagination(filteredItems, 100);

    const groupedByDateAndOrder = data.reduce<Record<string, Record<string, InventoryLog[]>>>((acc, log) => {
            if (!log.dateTime) {
                return acc; 
            }
            const dateOnly = log.dateTime.slice(0, 10);
            if (!acc[dateOnly]) {
                acc[dateOnly] = {};
            }
            const orderKey = String(log.orderId);
            if (!acc[dateOnly][orderKey]) {
                acc[dateOnly][orderKey] = [];
            }
            acc[dateOnly][orderKey].push(log);
            return acc;
        }, {});
    
    console.log(flattenGroupedLogsWithOrders(groupedByDateAndOrder));
    

    if (loading || authLoading) return <PapiverseLoading />
    return(
        <section className="stack-md animate-fade-in-up overflow-hidden max-md:mt-12">
            <AppHeader label="Inventory Logs" />

            <TableFilter 
                setSearch={ setSearch }
                searchPlaceholder="Search for an inventory log"
                size={ size }
                setSize={ setSize }
                removeAdd={true}
            />

            <AppTabSwitcher 
                tabs={ tabs }
                selectedTab={ activeTab }
                setSelectedTab={ setActiveTab }
            />

            {activeTab === 'Order Logs' && (
                <OrderLogs logs={ paginated.filter(i => i.source === 'ORDER') } />
            )}
            {activeTab === 'Input Logs' && (
                <InputLogs logs={ paginated.filter(i => i.source === 'INPUT') } />
            )}

            <TablePagination 
                data={ data }
                paginated={ paginated }
                page={ page }
                size={ size }
                setPage={ setPage }
            />
        </section>
    );
}