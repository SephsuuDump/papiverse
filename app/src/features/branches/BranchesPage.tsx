"use client"

import { PapiverseLoading } from "@/components/ui/loader";
import { Branch } from "@/types/branch";
import { Info, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { useFetchData } from "@/hooks/use-fetch-data";
import { AppHeader } from "@/components/shared/AppHeader";
import { TableFilter } from "@/components/shared/TableFilter";
import { usePagination } from "@/hooks/use-pagination";
import { TablePagination } from "@/components/shared/TablePagination";
import { BranchService } from "@/services/branch.service";
import { CreateBranch } from "./CreateBranch";
import { UpdateBranch } from "./UpdateBranch";
import { DeleteBranch } from "./DeleteBranch";

const columns = [
    { title: "Branch Name", style: "" },
    { title: "Full Address", style: "col-span-2" },
    { title: "Branch Type", style: "" },
    { title: "Actions", style: "" },
]

export function BranchesPage() {
    const [reload, setReload] = useState(false);

    const { data, loading } = useFetchData<Branch>(BranchService.getAllBranches, [reload]);
    const { search, setSearch, filteredItems } = useSearchFilter(data, ['branchName']);
    const { page, setPage, size, setSize, paginated, totalPages } = usePagination(filteredItems, 20);

    const [open, setOpen] = useState(false);
    const [toUpdate, setUpdate] = useState<Branch | undefined>();
    const [toDelete, setDelete] = useState<Branch | undefined>();
    console.log(data);
    

    if (loading) return <PapiverseLoading />
    return (
        <section className="flex flex-col gap-2">
            <AppHeader label="All Branches" />

            <TableFilter
                setSearch={ setSearch }
                searchPlaceholder="Search for a branch"
                setOpen={ setOpen }
                buttonLabel="Add a branch"
                size={ size }
                setSize={ setSize }
            />

            <div>
                <div className="thead grid grid-cols-5">
                    {columns.map((item, _) => (
                        <div key={_} className={`th ${item.style}`}>{ item.title }</div>
                    ))}
                </div>

                {paginated.length > 0 ? (
                    paginated.map((item, index) => (
                        <div className="tdata grid grid-cols-5" key={index}>
                            <div className="td">{ item.branchName }</div>
                            <div className="td col-span-2 break-words">
                                {`${item.streetAddress}, ${item.barangay}, ${item.city}, ${item.province}`}
                            </div>
                            <div className="td">
                                {item.isInternal ? "Internal Branch" : "External Branch"}
                            </div>
                            <div className="td flex-center-y gap-2">
                                <button onClick={() => setUpdate(item)}><SquarePen className="w-4 h-4 text-darkgreen" /></button>
                                <button><Info className="w-4 h-4" /></button>
                                <button onClick={() => setDelete(item)}><Trash2 className="w-4 h-4 text-darkred" /></button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="my-2 text-sm text-center col-span-6">There are no existing branches yet.</div>
                )}
            </div>

            <TablePagination
                data={ data }
                paginated={ paginated }
                page={ page }
                size={ size }
                setPage={ setPage }
            />

            {open && (
                <CreateBranch 
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}

            {toUpdate && (
                <UpdateBranch 
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}

            {toDelete && (
                <DeleteBranch
                    toDelete={ toDelete }
                    setDelete={ setDelete }
                    setReload={ setReload }
                />
            )}
        </section>
    )
}
