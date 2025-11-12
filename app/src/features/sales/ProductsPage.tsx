"use client"

import { AppHeader } from "@/components/shared/AppHeader";
import { TableFilter } from "@/components/shared/TableFilter";
import { TablePagination } from "@/components/shared/TablePagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { useFetchData } from "@/hooks/use-fetch-data";
import { usePagination } from "@/hooks/use-pagination";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { formatToPeso } from "@/lib/formatter";
import { ProductService } from "@/services/product.service";
import { Product } from "@/types/products";
import { Info, Salad, SquarePen, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateProduct } from "./components/CreateProduct";
import { UpdateProduct } from "./components/UpdateProduct";
import { DeleteProduct } from "./components/DeleteProduct";
import { PapiverseLoading, SectionLoading } from "@/components/ui/loader";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const columns = [
    { title: 'Product Name', style: '' },
    { title: 'Price', style: '' },
    { title: 'Category', style: '' },
    { title: 'Items Needed', style: '' },
    { title: 'Action', style: '' },
]

const filters = ["ALL PRODUCTS", "A'LA CARTE", "AFFORDABLE RICE MEALS", "ALL IN RICE BOWL", "BIG EVENT? WE GOT YOU", "BILAO BLOW OUT", "BINALOT NI PAPI", "BITES", "BURGERS", "CHEF'S PASTA", "CHEF'S PASTA 4-5 PAX", "COMBO A", "COMBO B", "COMBO C", "COMBO D", "COMBO E", "CRUNCHICKEN", "CRUNCHY BAGNET", "DINNER NIGHT TIME", "EXTRAS", "GRILLED SIZZLING BBQ DEALS", "KOPI NI PAPI", "KRISPY DELIGHTS", "KRISPY SISIG", "OVERLOAD SARAP", "PAPI FRIES", "PAPI'S FRUIT SODA", "PREMIUM BUNDLE DEALS", "QUENCHERS", "SALAD BLENDS", "SALO SALO SPECIAL", "SIGNATURE PLATES", "SIZZLING MEALS", "SNOWFROST HALO MIX", "SULIT RICE MIX", "UNLI BUNDLE DEALS", "UNLI DEALS"];

export function ProductsPage() {
    const [reload, setReload] = useState(false);
    const [filter, setFilter] = useState(filters[0]);
    const { data, loading, error } = useFetchData<Product>(ProductService.getAllProducts, [reload]);
    const { search, setSearch, filteredItems } = useSearchFilter(data, ['name']);

    const filteredData = filteredItems.filter(i => {
        if (filter === 'ALL PRODUCTS') return true;
        return i.category === filter;
    });

    const { page, setPage, size, setSize, paginated, totalPages } = usePagination(filteredData, 20);

    const [open, setOpen] = useState(false);
    const [toUpdate, setUpdate] = useState<Product | undefined>();
    const [toDelete, setDelete]  = useState<Product | undefined>();

    if (loading) return <SectionLoading />
    return (
        <section className="stack-md animate-fade-in-up">
            <TableFilter
                setSearch={ setSearch }
                searchPlaceholder="Search for a product"
                size={ size }
                setSize={ setSize }
                buttonLabel="Add a product"
                setOpen={ setOpen }
                filter={ filter }
                filters={ filters }
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
                        paginated.map((item, i) => (
                            <div className="tdata grid grid-cols-5" key={i}>
                                <div className="td">{ item.name.toUpperCase() }</div>
                                <div className="td">{ formatToPeso(item.price) }</div>
                                <div className="td">{ item.category }</div>
                                <Select>
                                    <SelectTrigger className="td font-semibold underline text-dark data-[state=open]:text-dark">
                                        Supplies Needed
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Supplies needed for { item.name }</SelectLabel>
                                            {item.itemsNeeded.map((subItem, index) => (
                                                <SelectItem 
                                                    key={ index } 
                                                    value={ subItem.code! }
                                                    className="flex"
                                                >
                                                    <div className="text-sm">
                                                        { subItem.type === 'PRODUCT' &&
                                                            <Tooltip>
                                                                <TooltipTrigger><Salad className="w-4 h-4 text-darkbrown inline-block -mt-1 mr-1" /></TooltipTrigger>
                                                                <TooltipContent>Product Item</TooltipContent>
                                                            </Tooltip> 
                                                        }
                                                        { subItem.name }
                                                    </div>
                                                    <div className="text-sm flex items-center ms-auto">
                                                        <X /> <div>{ subItem.quantity } { subItem.unitMeasurement ?? '' }</div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                            {item.groups!.length > 0 && <SelectLabel>Modifier Groups</SelectLabel>}
                                            {item.groups!.length > 0 && item.groups!.map((subItem) => (
                                                <SelectItem value={subItem.name!} key={subItem.name!}>{ subItem.name }</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <div className="td flex-center-y gap-2">
                                    <button onClick={ () => setUpdate(item) }><SquarePen className="w-4 h-4 text-darkgreen" /></button>
                                    <button><Info className="w-4 h-4" /></button>
                                    <button onClick={ () => setDelete(item) }><Trash2 className="w-4 h-4 text-darkred" /></button>
                                </div>
                            </div>
                        ))
                        : (<div className="my-2 text-sm text-center col-span-6">There are no existing products yet.</div>)
                    }
                </div>
            </div>

            <TablePagination 
                data={ data }
                paginated={ paginated }
                page={ page }
                size={ size }
                setPage={ setPage }
                search={ search }
                filter={ filter }
            />

            {open && 
                <CreateProduct
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            }

            {toUpdate && 
                <UpdateProduct
                    setUpdate={ setUpdate }
                    toUpdate={ toUpdate! }
                    setReload={ setReload }
                />
            }

            {toDelete && 
                <DeleteProduct
                    toDelete={ toDelete! }
                    setDelete={ setDelete }
                    setReload={ setReload }
                />
            }


        </section>
    )
}