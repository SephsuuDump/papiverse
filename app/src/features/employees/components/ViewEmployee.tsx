import { AppAvatar } from "@/components/shared/AppAvatar";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { formatDateToWords } from "@/lib/formatter";
import { NEXT_URL } from "@/lib/urls";
import { Employee } from "@/types/employee";
import { User } from "@/types/user";
import { Dispatch, SetStateAction } from "react";

export function ViewEmployee({
    toView,
    setView
}: {
    toView: Employee;
    setView: Dispatch<SetStateAction<Employee | undefined>>;
}) {
    return (
        <Dialog open onOpenChange={(open) => { if (!open) setView(undefined); }}>
            <DialogContent className="max-h-10/11 overflow-y-auto">
                <ModalTitle
                    label="Employee Information"
                />

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-4">
                    <div className="font-medium text-gray-600">First Name</div>
                    <div>{toView.firstName}</div>

                    <div className="font-medium text-gray-600">Last Name</div>
                    <div>{toView.lastName}</div>

                    <div className="font-medium text-gray-600">Email</div>
                    <div>{toView.email}</div>


                    <div className="font-medium text-gray-600">Position</div>
                    <div>{toView.position}</div>


                </div>

                <div className="flex justify-end mt-5">
                    <DialogClose className="text-sm">Close</DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
