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

const tabs = ['INPUT', 'ORDER', 'SALES'];

export function LogsPage() {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const { claims, loading: authLoading, isFranchisor } = useAuth();
    const { data, loading, error } = useFetchData<{
        date: string;
        logs: InventoryLog[]
    }>(
        InventoryService.getInventoryAudits,
        [claims.branch.branchId],
        [claims.branch.branchId, activeTab],
    );
    const { search, setSearch, filteredItems } = useSearchFilter(data, ['dateTime', 'orderId']);
    const { page, setPage, size, setSize, paginated, totalPages } = usePagination(filteredItems, 100);

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

            {activeTab === 'INPUT' && (
                <InputLogs logs={ paginated } />
            )}
            {activeTab === 'ORDER' && (
                <OrderLogs logs={ paginated } />
            )}
            {activeTab === 'SALES' && (
                <InputLogs logs={ paginated } />
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