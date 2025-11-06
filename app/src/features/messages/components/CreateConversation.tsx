import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreateModalSkeleton } from "@/components/ui/skeleton";
import { useFetchData } from "@/hooks/use-fetch-data";
import { MessagingService } from "@/services/messaging.service";
import { UserService } from "@/services/user.service";
import { Claim } from "@/types/claims";
import { User } from "@/types/user";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

interface CreateConversation {
    name: string;
    type: string;
    participantIds: number[];
}

export function CreateConversation({ 
    setOpen, 
    claims,
    setReload,
}: { 
    setOpen: (i: boolean) => void, 
    claims: Claim,
    setReload: Dispatch<SetStateAction<boolean>>
}) {
    const { data, loading } = useFetchData<User>(UserService.getAllUsers);

    const [users, setUsers] = useState<User[]>(data);
    const [onProcess, setProcess] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [conversation, setConversation] = useState<CreateConversation>({ 
        name: "none", 
        type: "group", 
        participantIds: [] 
    });
    
    function handleAdd(user: User) {
        setSelectedUsers(prev => [...prev, user]);
        setUsers(prev => prev.filter(u => u.id !== user.id));
    }

    function handleRemove(user: User) {
        setUsers(prev => [...prev, user]);
        setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
    }
    
    async function handleSubmit() {
        try {
            setProcess(true);
            setConversation(prev => ({
                ...prev,
                participantIds: [
                    ...prev.participantIds,              
                    ...selectedUsers.map(user => user.id!) 
                ]
            }));
            console.log('Conversation', conversation);
            
            if (conversation.participantIds.length > 2) {
                const data = await MessagingService.createDirectConversation(conversation);
                if (data) toast.success('Group created successfully!')
            } else {
                toast.info('Group chat must consist of 3 or more users.')
            }
        } catch (error) { toast.error(`${error}`) }
        finally {
            setReload(prev => !prev);
            setProcess(false);
            setOpen(!open);
        }
    }

    useEffect(() => {
        setConversation(prev => ({
            ...prev,
            participantIds: [
            claims.userId,
            ...selectedUsers.map(user => user.id!)
            ]
        }));
    }, [selectedUsers]);
    return(
        <Dialog open onOpenChange={ setOpen }>
            {loading ? (
                <CreateModalSkeleton />
            ) : (
                <DialogContent>
                    <DialogTitle className="flex items-center gap-2">
                        <Image
                            src="/images/kp_logo.png"
                            alt="KP Logo"
                            width={40}
                            height={40}
                        />
                        <div className="font-semibold text-xl">Create Conversation Group</div>  
                    </DialogTitle>
                    <Input 
                        onChange={ e => setConversation(prev => ({
                            ...prev,
                            name: e.target.value
                        }))}
                        placeholder="Enter group name"
                        className="border-1 border-gray"
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            {users.map((item, index) => {
                                if (claims.userId !== item.id) {
                                    return(
                                        <div 
                                            key={ index }
                                            className="relative flex items-center gap-1 rounded-md border-1 border-slate-300 p-4 my-2"
                                        >
                                            <Avatar>
                                                <AvatarFallback className="bg-darkbrown text-light">KP</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="text-sm truncate">{ `${item.firstName} ${item.lastName}` }</div>
                                                <div className="text-xs text-gray truncate">{ item.branch?.branchName }</div>
                                            </div>
                                            <button
                                                onClick={ () => handleAdd(item) }
                                                className="absolute flex justify-center items-center top-0 right-0 w-5 h-5 bg-darkgreen text-light rounded-full"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                        <div>
                            <div className="font-semibold text-center text-sm">Selected Users</div>
                            {selectedUsers.map((item, index) => (
                                <div 
                                    key={ index }
                                    className="relative flex items-center gap-1 rounded-md border-1 border-slate-300 p-4 my-2"
                                >
                                    <Avatar>
                                        <AvatarFallback className="bg-darkbrown text-light">KP</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="text-sm truncate">{ `${item.firstName} ${item.lastName}` }</div>
                                        <div className="text-xs text-gray truncate">{ item.branch?.branchName }</div>
                                    </div>
                                    <button
                                        onClick={ () => handleRemove(item) }
                                        className="absolute flex justify-center items-center top-0 right-0 w-5 h-5 bg-darkred text-light rounded-full"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <form 
                        onSubmit={ e => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        className="flex justify-end gap-4"
                    >
                        <DialogClose className="text-sm">Close</DialogClose>
                        <AddButton 
                            type="submit"
                            onProcess={ onProcess }
                            label="Create Group"
                            loadingLabel="Creating Group"
                        />
                    </form>
                </DialogContent>
            )}
        </Dialog>
    );
}