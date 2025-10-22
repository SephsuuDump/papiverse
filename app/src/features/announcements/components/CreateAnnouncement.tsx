import { useAuth } from "@/hooks/use-auth";
import { announcementInit, Announcement } from "@/types/announcement";
import React, { useEffect, useState, ChangeEvent } from "react";
import { toast } from "sonner"; // Assuming sonner toast
import { FileImage, Upload, X } from "lucide-react"; // or your icon library
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog"; // adjust imports for Dialog
import { Textarea } from "@/components/ui/textarea"; // adjust imports for Textarea
import { Toaster } from "@/components/ui/sonner";
import { AnnouncementService } from "@/services/announcement.service";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton } from "@/components/ui/button";
import { getPhilippineTimeISO } from "@/lib/formatter";

interface Preview {
  url: string;
  name: string;
  size: number;
}

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateAnnouncement({ setOpen }: Props) {
    const { claims, loading } = useAuth();
    const [announcement, setAnnouncement] = useState<Announcement>(announcementInit);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<Preview[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        const { name, value } = e.target;
        if (claims && claims.userId) {
            setAnnouncement(prev => ({ ...prev, userId: Number(claims.userId), [name]: value }));
        } else {
            setAnnouncement(prev => ({ ...prev, [name]: value }));
        }
    };

    function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);

        const validFiles: File[] = files.filter(file => {
            const isValidType = file.type.startsWith("image/");
            const isValidSize = file.size <= 10 * 1024 * 1024; 

            if (!isValidType) {
                toast.error(`${file.name} is not a valid image file`);
                return false;
            }

            if (!isValidSize) {
                toast.error(`${file.name} is too large (max 10MB)`);
                return false;
            }
            
            return true;
        });

        if (validFiles.length === 0) return;

        // Add to existing images instead of replacing
        setSelectedImages(prev => [...prev, ...validFiles]);

        // Create preview URLs for new files
        const newPreviewUrls: Preview[] = validFiles.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
        }));

        setPreviews(prev => [...prev, ...newPreviewUrls]);

        // Clear the input
        e.target.value = "";
    };

    const removeImage = (index: number) => {
        // Revoke the object URL to free memory
        URL.revokeObjectURL(previews[index].url);

        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            previews.forEach(preview => URL.revokeObjectURL(preview.url));
        };
    }, [previews]);

    const resetForm = () => {
        setAnnouncement({
            content: "",
            announcementImages: [],
            userId: claims.userId,
            datePosted: getPhilippineTimeISO(),
        });
        setSelectedImages([]);
        setPreviews([]);
    };
    console.log('Date', getPhilippineTimeISO());
    

    async function handleSubmit() {
        if (!announcement.content.trim()) {
            toast.error("Please enter announcement content");
            return;
        }

        setIsUploading(true);

        try {

            const data = await AnnouncementService.createAnnouncement(announcement, selectedImages);

            if (data) {
                toast.success("Successfully created a post!");
                resetForm();
            }
        } catch (error) {
            toast.error("Failed to create announcement");
        } finally {
            setIsUploading(false);
        }
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <>
        <Toaster position="top-center" />
        <Dialog open onOpenChange={ setOpen }>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <ModalTitle label="Post Announcement" />
                <label className="w-fit bg-slate-50 px-3 py-2 rounded-md flex items-center gap-2 transition-colors text-sm">
                    <FileImage className="h-4 w-4" />
                    Add Images
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </label>

                <div className="space-y-4">
                    <div>
                    <Textarea
                        name="content"
                        placeholder="Type your announcement here"
                        className="h-40"
                        onChange={handleChange}
                        value={announcement.content}
                        required
                    />
                    </div>

                    {/* Image previews */}
                    {previews.length > 0 && (
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Selected Images ({previews.length})
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                    previews.forEach(preview => URL.revokeObjectURL(preview.url));
                                    setSelectedImages([]);
                                    setPreviews([]);
                                    }}
                                    className="text-xs text-red-500 hover:text-red-700"
                                >
                                    Remove All
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {previews.map((preview, idx) => (
                                <div key={idx} className="relative group">
                                <img
                                    src={preview.url}
                                    alt={`Preview ${idx + 1}`}
                                    className="w-full h-24 object-cover rounded-md border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 rounded-b-md">
                                    <div className="truncate">{preview.name}</div>
                                    <div className="text-gray-300">{formatFileSize(preview.size)}</div>
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    )}

                    {/* Upload area when no images */}
                    {previews.length === 0 && (
                        <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm mb-1">No images selected</p>
                            <p className="text-xs text-gray-400">
                            Click "Add Images" to upload multiple images (max 10MB each)
                            </p>
                        </button>
                    )}

                    <form
                        className="flex justify-end gap-4"
                        onSubmit={ e => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <DialogClose className="text-sm">Close</DialogClose>
                        <AddButton 
                            type="submit"
                            onProcess={ isUploading }
                            label="Create Post"
                            loadingLabel="Creating Post"
                        />
                    </form>
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
}
