"use client"

import { AppHeader } from "@/components/shared/AppHeader";
import { AppTabSwitcher } from "@/components/shared/AppTabSwitcher";
import { useState } from "react";
import { ProductsPage } from "./ProductsPage";
import { ModifierGroupsPage } from "./ModifierGroupPage";
import { useSearchParams } from "next/navigation";

const tabs = ['Products', 'Modifier Groups']

export function ProductEntitiesPage() {
    const searchParam = useSearchParams();
    const [tab, setTab] = useState(searchParam.get('tab') ?? tabs[0]);
    return (
        <section className="stack-md animate-fade-in-up overflow-hidden max-md:mt-12">
            <AppHeader label={`All ${tab}`} />
            <AppTabSwitcher
                tabs={ tabs }
                selectedTab={ tab }
                setSelectedTab={ setTab }
            />

            {tab === tabs[0] && (
                <ProductsPage />
            )}

            {tab === tabs[1] && (
                <ModifierGroupsPage />
            )}
        </section>
    )
}