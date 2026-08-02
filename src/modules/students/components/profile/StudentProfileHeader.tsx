"use client";

import Image from "next/image";
import { Card } from "@/components/ui";
import { formatClassSection } from "@/modules/students/utils/formatters";

type Props = {
  name?: string | null;
  studentId?: string | null;
  className?: string | null;
  section?: string | null;
  photoUrl?: string | null;
};

export default function StudentProfileHeader({
  name,
  studentId,
  className,
  section,
  photoUrl,
}: Props) {
  return (
    <Card className="flex items-center gap-6 mb-5">
      <div className="bg-slate-400 rounded-full overflow-hidden w-[62px] h-[62px] items-center flex-shrink-0">
        <Image
          src={photoUrl || "/images/avatar.png"}
          alt={name ? `${name} avatar` : "avatar"}
          width={62}
          height={62}
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-1 gap-2 flex flex-col">
        <div className="text-[20px] lg:text-[24px] font-[600] text-[#021034]">
          {name ?? "-"}
        </div>
        <div className="text-[13px] lg:text-[14px] font-[400] text-[#737373]">
          Student ID:{" "}
          <span className="text-[#021034]">{studentId ?? "-"}</span>
        </div>
        <div className="flex gap-2">
          <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 border rounded-full border-[#D7E3FC] bg-[#F5F9FF]">
            {formatClassSection(className, section)}
          </p>
        </div>
      </div>
    </Card>
  );
}
