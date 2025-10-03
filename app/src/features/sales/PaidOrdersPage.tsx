"use client"

import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Download, Funnel, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { PaidOrder } from "@/types/sales";
import { AppHeader } from "@/components/shared/AppHeader";
import { TableFilter } from "@/components/shared/TableFilter";
import { PaidOrdersAccordion } from "./PaidOrdersAccordion";
import { InsertPaidOrdersExcel } from "./InsertPaidOrdersExcel";
import { PaidOrdersPreview } from "./PaidOrdersPreview";
import { useFetchData } from "@/hooks/use-fetch-data";
import { SalesService } from "@/services/sales.service";
import { useAuth } from "@/hooks/use-auth";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { usePagination } from "@/hooks/use-pagination";

export default function PaidOrdersPage() {
    const [reload, setReload] = useState(false);
    const [paidOrdersPreview, setPaidOrdersPreview] = useState<PaidOrder[]>([]);
    const [open, setOpen] = useState(false);

    const { claims, loading: authLoading } = useAuth();
    const { data, loading, error } = useFetchData<PaidOrder>(SalesService.getPaidOrders, [reload], [claims.branch.branchId, '2025-08-20', '2025-08-20']);
    const { search, setSearch, filteredItems } = useSearchFilter(data, ['orderId']);
    const { page, setPage, size, setSize, paginated, totalPages } = usePagination(filteredItems, 20);
    

    return(
        <section className="flex flex-col gap-2">
            <AppHeader label="Paid Orders" />
            <TableFilter 
                setSearch={ setSearch }
                searchPlaceholder="Search for an order"
                size={ size }
                setSize={ setSize }
                setOpen={ setOpen }
                buttonLabel="Add Order"
            />
            
            <PaidOrdersAccordion paidOrders={ data } />

            {open && (
                <InsertPaidOrdersExcel 
                    setOpen={ setOpen }
                    setPaidOrdersPreview={ setPaidOrdersPreview }
                />
            )}

            {paidOrdersPreview.length > 0 && (
                <PaidOrdersPreview 
                    claims={ claims }
                    paidOrdersPreview={ paidOrdersPreview }
                    setPaidOrdersPreview={ setPaidOrdersPreview }
                    setReload={ setReload }
                />
            )}
        </section>
    )
}