import Image from "next/image";
import { NEXT_URL } from "@/lib/urls";

export function AnnouncementImages({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;

  return (
    <section className="w-full overflow-hidden rounded-sm">
      {images.length === 1 ? (
        // 🟢 One image — big and wide
        <div className="relative w-full rounded-sm overflow-hidden">
          <Image
            src={`${NEXT_URL}${images[0]}`}
            alt=""
            width={1200}
            height={800}
            className="w-full h-auto object-cover rounded-sm"
          />
        </div>
      ) : images.length === 2 ? (
        // 🟠 Two images — side by side
        <div className="flex gap-1">
          {images.map((img, i) => (
            <div key={i} className="flex-1 relative overflow-hidden rounded-sm">
              <Image
                src={`${NEXT_URL}${img}`}
                alt=""
                width={600}
                height={600}
                className="w-full h-full object-cover rounded-sm"
              />
            </div>
          ))}
        </div>
      ) : images.length === 3 ? (
        // 🔵 Three images — one big left, two stacked right
        <div className="flex gap-1 h-[400px]">
          <div className="flex-1 relative overflow-hidden rounded-sm">
            <Image
              src={`${NEXT_URL}${images[0]}`}
              alt=""
              width={800}
              height={800}
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
          <div className="flex flex-col flex-1 gap-1">
            {images.slice(1).map((img, i) => (
              <div key={i} className="relative flex-1 overflow-hidden rounded-sm">
                <Image
                  src={`${NEXT_URL}${img}`}
                  alt=""
                  width={600}
                  height={300}
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        // 🟣 4 or more images — grid layout like Facebook
        <div className="grid grid-cols-2 gap-1 h-[500px]">
          {images.slice(0, 4).map((img, i) => (
            <div key={i} className="relative overflow-hidden rounded-sm">
              <Image
                src={`${NEXT_URL}${img}`}
                alt=""
                width={600}
                height={600}
                className="w-full h-full object-cover rounded-sm"
              />
              {i === 3 && images.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    +{images.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
