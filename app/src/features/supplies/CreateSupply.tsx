import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Branch, branchFields, branchInit } from "@/types/branch";
import { Supply, supplyFields, supplyInit } from "@/types/supply";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { handleChange } from "@/lib/form-handle";
import { SupplyService } from "@/services/supply.service";

const categories = ["MEAT", "SNOWFROST"];
const units = ["kilograms", "grams", "milligrams", "piece", "oz", "pack"]

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateSupply({ setOpen, setReload }: Props) {
    const [loading, setLoading] = useState(true);
    const [onProcess, setProcess] = useState(false);

    const [supply, setSupply] = useState<Supply>(supplyInit);
    const [date, setDate] = useState<Date | undefined>();
    const [dateOpen, setDateOpen] = useState(false);

    async function handleSubmit() {
        try{         
            setProcess(true);
            let invalid = false;
            for (const field of supplyFields) {
                if (!supply[field]) {
                    invalid = true;
                }
            }
            if (invalid) {
                toast.info("Please fill up all fields!");
                setProcess(false);
                return
            }
            const data = await SupplyService.addSupply(supply);
            if (data) {
                toast.success(`Supply ${supply.name} registered successfully!`); 
                setReload(prev => !prev);
                setProcess(false);
                setOpen(!open);
            }   
        }
        catch(error){ toast.error(`${error}`) }
    }

    return(
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent className="overflow-y-auto">
                <DialogTitle className="flex items-center gap-2">  
                    <Image
                        src="/images/kp_logo.png"
                        alt="KP Logo"
                        width={40}
                        height={40}
                    />
                    <div className="font-semibold text-xl">Create Supply</div>      
                </DialogTitle>
                <form className="flex flex-col gap-4" onSubmit={ e => {
                    e.preventDefault();
                    handleSubmit();
                }}
                >
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                            <div>SKU ID</div>
                            <Input    
                                className="w-full border-1 border-gray rounded-md max-md:w-full" 
                                placeholder="e.g. RAW001"
                                name ="code"  
                                value={supply.code}
                                onChange={ e => handleChange(e, setSupply)}
                            />  
                        </div>
                        <div className="flex flex-col gap-1">
                            <div>Category</div>
                            <Select
                                value={ supply.category }
                                onValueChange={ (value) => setSupply(prev => ({
                                    ...prev,
                                    category: value
                                })) }
                            >
                                <SelectTrigger className="w-full border-1 border-gray">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((item, index) => (
                                        <SelectItem value={ item } key={ index }>{ item }</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                            <div>Supply Name</div>
                            <Input    
                                className="w-full border-1 border-gray rounded-md max-md:w-full" 
                                name ="name"  
                                value={supply.name}
                                onChange={ e => handleChange(e, setSupply)}
                            />  
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                            <div>Unit Measurement</div>
                            <div className="flex border-1 border-gray rounded-md max-md:w-full">
                                <Input    
                                    className="w-full border-0" 
                                    type="number"
                                    name ="unitQuantity"  
                                    value={supply.unitQuantity}
                                    onChange={ e => handleChange(e, setSupply)}
                                />  
                                <Select
                                    value={ supply.unitMeasurement }
                                    onValueChange={ (value) => setSupply(prev => ({
                                        ...prev,
                                        unitMeasurement: value
                                    })) }
                                >
                                    <SelectTrigger className="w-full border-0">
                                        <SelectValue placeholder="Select Measurement" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((item, index) => (
                                            <SelectItem value={ item } key={ index }>{ item }</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div>Internal Price</div>
                            <div className="flex border-1 border-gray rounded-md">
                                <input disabled value="₱" className="w-10 text-center" /> 
                                <Input 
                                    type="number"
                                    className="w-full max-md:w-full" 
                                    name ="unitPriceInternal"  
                                    value={supply.unitPriceInternal}
                                    onChange={ e => handleChange(e, setSupply) }
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div>External Price</div>
                            <div className="flex border-1 border-gray rounded-md">
                                <input disabled value="₱" className="w-10 text-center" /> 
                                <Input 
                                    type="number"
                                    className="w-full max-md:w-full" 
                                    name ="unitPriceExternal"  
                                    value={supply.unitPriceExternal}
                                    onChange={ e => handleChange(e, setSupply) }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4">
                        <DialogClose className="text-sm">Close</DialogClose>
                        <AddButton 
                            type="submit"
                            onProcess={ onProcess }
                            label="Add Supply"
                            loadingLabel="Adding Supply"
                        />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}