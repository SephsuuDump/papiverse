"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormLoader, PapiverseLoading } from "@/components/ui/loader";
import { Select, SelectTrigger } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { formatToPeso } from "@/lib/formatter";
import { Inventory } from "@/types/inventory";
import { SelectValue } from "@radix-ui/react-select";
import { CirclePlus, Download, Funnel, Ham, Info, Plus, Snowflake, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/pagination";
import { useFetchData } from "@/hooks/use-fetch-data";
import { InventoryService } from "@/services/inventory.service";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { AppHeader } from "@/components/shared/AppHeader";
import { TableFilter } from "@/components/shared/TableFilter";
import { usePagination } from "@/hooks/use-pagination";
import { styleText } from "util";
import { TablePagination } from "@/components/shared/TablePagination";

const columns = [
    { title: 'SKU ID', style: '' },
    { title: 'Supply Name', style: '' },
    { title: 'Quantity', style: '' },
    { title: 'Unit Price', style: '' },
    { title: 'Action', style: '' },
]

export function InventoriesPage() {
    const { claims, loading: authLoading } = useAuth();
    const { data, loading, error } = useFetchData<Inventory>(
        InventoryService.getInventoryByBranch,
        [claims.branch.branchId],
        [claims.branch.branchId]
    );
    const { search, setSearch, filteredItems } = useSearchFilter(data, ['name', 'code']);
    const { page, setPage, size, setSize, paginated, totalPages } = usePagination(filteredItems, 20);

    const [open, setOpen] = useState(false);
    const [toUpdate, setUpdate] = useState<Inventory>();

    if (loading || authLoading) return <PapiverseLoading />
    return(
        <section className="flex flex-col gap-2">
            <AppHeader label="All Inventories" />
            <TableFilter 
                setSearch={ setSearch }
                searchPlaceholder="Search for an inventory"
                setOpen={ setOpen }
                size={ size }
                setSize={ setSize }
                removeAdd
            />

            <div>
                <div className="thead grid grid-cols-5">
                    {columns.map((item, _) => (
                        <div key={_} className={`th ${item.style}`}>{ item.title }</div>
                    ))}
                </div>

                {paginated.length > 0 ?
                    paginated.map((item, index) => (
                        <div className="tdata grid grid-cols-5" key={ index }>
                            <div className="td">{ item.code }</div>
                            <div className="td flex gap-2">
                                <Tooltip>
                                    <TooltipTrigger>
                                        {item.category === 'MEAT' ? <Ham className="w-4 h-4 text-darkbrown"/> : <Snowflake className="w-4 h-4 text-blue" />}
                                    </TooltipTrigger>
                                    <TooltipContent>{ item.category === 'MEAT' ? "MEAT Category" : "SNOW FROST Category"}</TooltipContent>
                                </Tooltip>
                                <div>{ item.name }</div>
                            </div>
                            <div className="td">{ item.quantity }</div>
                            <div className="td">{ formatToPeso(item.unitPrice!) }</div>
                            <div className="td flex-center-y gap-2">
                                <button onClick={ () => setUpdate(item) }><SquarePen className="w-4 h-4 text-darkgreen" /></button>
                                <button><Info className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))
                    : (<div className="my-2 text-sm text-center col-span-6">There are no existing supplies yet.</div>)
                }
            </div>

            <TablePagination 
                data={ data }
                paginated={ paginated }
                page={ page }
                size={ size }
                setPage={ setPage }
            />
       
        </section>
    )
}