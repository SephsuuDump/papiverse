"use client"

import { PapiverseLoading } from "@/components/ui/loader";
import { User } from "@/types/user";
import { Info, SquarePen, Trash2 } from "lucide-react";
import { useState } from "react";
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

const columns = [
    { title: "Full Name", style: "" },
    { title: "E-mail Address", style: "" },
    { title: "Username", style: "" },
    { title: "Branch", style: "" },
    { title: "Actions", style: "" },
]

export function UsersPage() {
    const [reload, setReload] =  useState(false);

    const { data, loading, error } = useFetchData<User>(UserService.getAllUsers, [reload]);
    const { search, setSearch, filteredItems } = useSearchFilter(data, ['firstName', 'lastName']);
    const { page, setPage, size, setSize, paginated, totalPages } = usePagination(filteredItems, 20);

    const [open, setOpen] = useState(false);
    const [toUpdate, setUpdate] = useState<User | undefined>();
    const [toDelete, setDelete] = useState<User | undefined>();

    if (loading) return <PapiverseLoading />
    return(
        <section className="flex flex-col gap-2">
            <AppHeader label="All Users" />

            <TableFilter
                setSearch={ setSearch }
                searchPlaceholder="Search for a user"
                setOpen={ setOpen }
                buttonLabel="Add a user"
                size={ size }
                setSize={ setSize }
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

            <TablePagination
                data={ data }
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