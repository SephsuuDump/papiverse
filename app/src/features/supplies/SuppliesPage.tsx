"use client"

import { PapiverseLoading } from "@/components/ui/loader";
import { formatToPeso } from "@/lib/formatter";
import { Supply } from "@/types/supply";
import { Ham, Info, Snowflake, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { CreateSupply } from "./CreateSupply";
import { useFetchData } from "@/hooks/use-fetch-data";
import { SupplyService } from "@/services/supply.service";
import { AppHeader } from "@/components/shared/AppHeader";
import { TableFilter } from "@/components/shared/TableFilter";
import { usePagination } from "@/hooks/use-pagination";
import { TablePagination } from "@/components/shared/TablePagination";
import { UpdateSupply } from "./UpdateSupply";
import { DeleteSupply } from "./DeleteSupply";

const columns = [
    { title: "SKU ID", style: "" },
    { title: "Supply Name", style: "" },
    { title: "Unit", style: "" },
    { title: "Internal Price", style: "" },
    { title: "External Price", style: "" },
    { title: 'Action', style: '' }
]

export function SuppliesPage() {
    const [reload, setReload] = useState(false);

    const { data, loading, error } = useFetchData(SupplyService.getAllSupplies, [reload]);
    const { search, setSearch, filteredItems } = useSearchFilter(data, ['code', 'name']); 
    const { page, setPage, size, setSize, paginated, totalPages } = usePagination(filteredItems, 20);    

    const [open, setOpen] = useState(false);
    const [toUpdate, setUpdate] = useState<Supply>()
    const [toDelete, setDelete] = useState<Supply>();

    if (loading) return <PapiverseLoading />
    return(
        <section className="flex flex-col gap-2">
            <AppHeader label="All Supplies" />
            <TableFilter 
                setSearch={ setSearch }
                searchPlaceholder="Search for a supply"
                setOpen={ setOpen }
                buttonLabel="Add a supply"
                size={ size }
                setSize={ setSize }
            />

            <div>
                <div className="thead grid grid-cols-6">
                    {columns.map((item, _) => (
                        <div key={_} className={`th ${item.style}`}>{ item.title }</div>
                    ))}
                </div>
                
                {paginated.length > 0 ?
                    paginated.map((item, index) => (
                        <div className="tdata grid grid-cols-6" key={ index }>
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
                            <div className="td">{ `${item.unitQuantity} ${item.unitMeasurement}` }</div>
                            <div className="td">{ formatToPeso(item.unitPriceInternal!) }</div>
                            <div className="td">{ formatToPeso(item.unitPriceExternal!) }</div>
                            <div className="td flex-center-y gap-2">
                                <button onClick={ () => setUpdate(item) }><SquarePen className="w-4 h-4 text-darkgreen" /></button>
                                <button><Info className="w-4 h-4" /></button>
                                <button
                                    onClick={ () => setDelete(item) }
                                >
                                    <Trash2 className="w-4 h-4 text-darkred" />
                                </button>
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

            {open && (
                <CreateSupply 
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}

            {toUpdate && (
                <UpdateSupply
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}

            {toDelete && (
                <DeleteSupply
                    toDelete={ toDelete }
                    setDelete={ setDelete }
                    setReload={ setReload }
                />
            )}

        </section>
    )
}