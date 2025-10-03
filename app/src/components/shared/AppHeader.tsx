import Image from "next/image";

export function AppHeader({ label }: {
    label: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <Image
                src="/images/kp_logo.png"
                alt="KP Logo"
                width={40}
                height={40}
            />
            <div className="text-xl font-semibold">{ label }</div>
            <Image
                src="/images/papiverse_logo.png"
                alt="KP Logo"
                width={100}
                height={100}
                className="ms-auto"
            />
        </div>
    )
}