"use client"

import { PapiverseLoading } from "@/components/ui/loader";
import { User } from "@/types/user";
import { Info, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { CreateUser } from "./CreateUser";
import { UpdateUser } from "./UpdateUser";
import { DeleteUser } from "./DeleteUser";
import { useFetchData } from "@/hooks/use-fetch-data";
import { UserService } from "@/services/user.service";
import { AppHeader } from "@/components/shared/AppHeader";
import { TableFilter } from "@/components/shared/TableFilter";
import { TableDataTooltip } from "./TableDataTooltip";
import { usePagination } from "@/hooks/use-pagination";
import { TablePagination } from "@/components/shared/TablePagination";
import { requireRole } from "@/lib/auth";
import { useCrudState } from "@/hooks/use-crud-state";

const columns = [
    { title: "Full Name", style: "" },
    { title: "E-mail Address", style: "" },
    { title: "Username", style: "" },
    { title: "Branch", style: "" },
    { title: "Actions", style: "" },
]

const filters = ['All', 'Franchisor', 'Franchisee'];

export function UsersPage() {
    const [reload, setReload] =  useState(false);
    const [filter, setFilter] = useState(filters[0]);

    const { data, loading, error } = useFetchData<User>(UserService.getAllUsers, [reload]);
    const { search, setSearch, filteredItems } = useSearchFilter(data, ['firstName', 'lastName']);

    const filteredData = filteredItems.filter(i => {
        if (filter === 'Franchisor') return i.role === 'FRANCHISOR';
        if (filter === 'Franchisee') return i.role === 'FRANCHISEE';
        return true;
    });

    const { page, setPage, size, setSize, paginated, totalPages } = usePagination(filteredData, 20);
    const { open, setOpen, toUpdate, setUpdate, toDelete, setDelete } = useCrudState<User>();

    if (loading) return <PapiverseLoading />
    return(
        <section className="stack-md animate-fade-in-up overflow-hidden max-md:mt-12">
            <AppHeader label="All Users" />

            <TableFilter
                setSearch={ setSearch }
                searchPlaceholder="Search for a user"
                setOpen={ setOpen }
                buttonLabel="Add a user"
                size={ size }
                setSize={ setSize }
                filters={ filters }
                filter={ filter }
                setFilter={ setFilter }
            />

            <div className="table-wrapper">
                <div className="thead grid grid-cols-5">
                    {columns.map((item, _) => (
                        <div key={_} className={`th ${item.style}`}>{ item.title }</div>
                    ))}
                </div>

                <div className="animate-fade-in-up" key={`${page}-${filter}`}>
                    {paginated.length > 0 ?
                        paginated.map((item, index) => (
                            <div className="tdata grid grid-cols-5" key={ index }>
                                <div className="td break-words">{ `${item.lastName}, ${item.firstName} ${item.middleName}` }</div>
                                <TableDataTooltip content={ item.email! } className="truncate" />
                                <div className="td-wrap">{ item.username }</div>
                                <div className="td break-words">{ item.branch?.branchName }</div>
                                <div className="td flex-center-y gap-2">
                                    <button onClick={ () => setUpdate(item) }><SquarePen className="w-4 h-4 text-darkgreen" /></button>
                                    <button><Info className="w-4 h-4" /></button>
                                    <button onClick={ () => setDelete(item) }><Trash2 className="w-4 h-4 text-darkred" /></button>
                                </div>
                            </div>
                        ))
                        : (<div className="my-2 text-sm text-center col-span-6">There are no existing users yet.</div>)
                    }
                </div>  
            </div>

            <TablePagination
                data={ filteredData }
                paginated={ paginated }
                page={ page }
                size={ size }
                setPage={ setPage }
            />

            {open && (
                <CreateUser 
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}

            {toUpdate && (
                <UpdateUser 
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}

            {toDelete && (
                <DeleteUser
                    toDelete={ toDelete }
                    setDelete={ setDelete }
                    setReload={ setReload }
                />
            )}
        </section>
    )
}