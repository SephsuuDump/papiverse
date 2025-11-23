"use client";

import { AppHeader } from "@/components/shared/AppHeader";
import { PapiverseLoading } from "@/components/ui/loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useFetchData } from "@/hooks/use-fetch-data";
import { BranchService } from "@/services/branch.service";
import { Branch } from "@/types/branch";
import { useEffect, useState } from "react";
import { SalesPage } from "./SalesPage";

export function BranchSalesPage() {
    const { data: branches, loading: branchesLoading } = useFetchData<Branch>(
        BranchService.getAllBranches,
    );

    const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

    useEffect(() => {
        if (branches?.length) {
            setSelectedBranch(branches[0].branchId!);
        }
    }, [branches]);


    if (branchesLoading) return <PapiverseLoading />;

    return (
        <div className="flex gap-2">

            {/* -------------------- */}
            {/* SIDEBAR */}
            {/* -------------------- */}
            <aside className="w-64 bg-white shadow-md border-r h-full p-4 flex flex-col rounded-md">
                <h2 className="text-lg font-semibold text-darkbrown mb-4">
                    Branches
                </h2>

                <ScrollArea className="flex flex-col overflow-y-auto">
                    {branches.map((item) => (
                        <div key={item.branchId}>
                            <button
                                onClick={() => setSelectedBranch(item.branchId!)}
                                className={`
                                    w-full text-left px-3 py-2 rounded-md transition text-sm font-medium
                                    ${selectedBranch === item.branchId 
                                        ? "rounded-none border-x-5 border-darkorange font-semibold" 
                                        : "hover:bg-gray-100"
                                    }
                                `}
                            >
                                {item.branchName}
                            </button>
                            <Separator className="my-1" />
                        </div>
                    ))}
                </ScrollArea>
            </aside>

            {/* -------------------- */}
            {/* MAIN CONTENT AREA */}
            {/* -------------------- */}
            <main className="flex-1">
                {selectedBranch ? (
                    <div>
                        <AppHeader label={`${branches.find((b) => b.branchId === selectedBranch)?.branchName} Sales`} />
                        <SalesPage branchId={ selectedBranch } />
                    </div>
                ) : (
                    <div className="text-gray-500">Select a branch to view sales.</div>
                )}
            </main>
        </div>
    );
}
