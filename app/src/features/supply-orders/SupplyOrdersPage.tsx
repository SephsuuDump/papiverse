"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SupplyOrder } from "@/types/supplyOrder";
import { SupplyOrderService } from "@/services/supplyOrder.service";
import { AppHeader } from "@/components/shared/AppHeader";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { usePagination } from "@/hooks/use-pagination";
import { TableFilter } from "@/components/shared/TableFilter";
import { PendingOrders } from "./PendingOrders";
import { TablePagination } from "@/components/shared/TablePagination";
import { PapiverseLoading } from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const tabs = ['Pending', 'Completed', 'Rejected']

export default function SupplyOrdersPage() {
    const router = useRouter();
    const [reload, setReload] = useState(false);
    const [tab, setTab] = useState('Pending');
    const [open, setOpen] = useState(false);

    const { claims, loading: authLoading } = useAuth();
    
    const isCommisary = claims.branch.branchId === 1;
    const fetchAll = useFetchData<SupplyOrder>(SupplyOrderService.getAllSupply, [reload, claims]);
    const fetchByBranch = useFetchData<SupplyOrder>(SupplyOrderService.getSupplyOrderByBranch, [reload, claims], [claims.branch.branchId]);
    
    const { data, loading, error } = isCommisary ? fetchAll : fetchByBranch;
    const { search, setSearch, filteredItems } = useSearchFilter(data, ['branchName', 'snowfrostCategory.snowFrostOrderId', 'meatCategory.meatOrderId']);
    const { page, setPage, size, setSize, paginated, totalPages } = usePagination(filteredItems, 100);

    useEffect(() => {
        if (open) {
            router.push("/inventory/supply-order-form");
        }
    }, [open, router]);

    if (loading || authLoading) return <PapiverseLoading />
    return(
        <section className="flex flex-col gap-2">
            <AppHeader label='Supply Orders' />
            <div className="w-fit flex-center bg-slate-50 shadow-sm rounded-full">
                {tabs.map((item, i) => (
                    <Button
                        key={i}
                        onClick={ () => setTab(item) }
                        className={`w-30 rounded-full !bg-slate-50 text-dark hover:opacity-50 ${tab === item && "!bg-darkbrown text-light hover:opacity-100"}`}
                    >
                        { item }
                    </Button>
                ))}
            </div>

            <TableFilter
                setSearch={ setSearch }
                searchPlaceholder="Search for a supply order"
                size={ size }
                setSize={ setSize }
                removeAdd={claims.roles[0] === 'FRANCHISOR' ? true : false}
                setOpen={ setOpen }
                buttonLabel="Order supplies"
            />

            {tab === 'Pending' && (
                <PendingOrders 
                    paginated={ paginated.filter(i => i.status === 'PENDING' || i.status === 'TO FOLLOW') } 
                    setReload={ setReload }
                />
            )}

            <TablePagination
                data={ data }
                paginated={ paginated }
                size={ size }
                setPage={ setPage }
                page={ page }
            />
        </section>
    );
}