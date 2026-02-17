import Image from "next/image";
import Card from "../../../../../components/ui/Card";
import ClassSubjectAllocationTable from "./components/ClassSubjectAllocationTable";
import Button from "../../../../../components/ui/Button";

const allocations = [
  {
    grade: "Grade-10",
    section: "Section-A",
    subject: "Mathematics",
    role: "Class Teacher",
  },
  {
    grade: "Grade-09",
    section: "Section-A",
    subject: "English",
    role: "Subject Teacher",
  },
  {
    grade: "Grade-11",
    section: "Section-A",
    subject: "Hindi",
    role: "Subject Teacher",
  },
  {
    grade: "Grade-09",
    section: "Section-A",
    subject: "Mathematics",
    role: "Subject Teacher",
  },
  {
    grade: "Grade-12",
    section: "Section-A",
    subject: "Mathematics",
    role: "Subject Teacher",
  },
];

export default function page() {
  return (
    <div className="p-3 md:p-6">
      {/* Header */}
      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] text-[#021034] font-[600]">
              Teacher Profile Management
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage, view and Edit Teacher
            </p>
          </div>

          <div>
            <Button variant="dark">+ Edit Profile</Button>
          </div>
        </div>
      </section>

      {/* Profile Card */}
      <Card className="flex items-center gap-6 mb-[20px]">
        <div className="bg-slate-400 rounded-full overflow-hidden w-[62px] h-[62px] flex-shrink-0">
          <Image
            src="/images/avatar.png"
            alt="avatar"
            width={62}
            height={62}
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1 gap-2 flex flex-col">
          <div className="text-[20px] lg:text-[24px] font-[600] text-[#021034]">
            Manoj Dhosai
          </div>

          <div className="text-[13px] lg:text-[14px] font-[400] text-[#737373]">
            Teacher ID: <span className="text-[#021034]">STU-001</span>
          </div>

          <div className="flex gap-2">
            <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 border rounded-full border-[#D7E3FC] bg-[#F5F9FF]">
              Mathematics Specialization
            </p>
            <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 rounded-full bg-[#F4E8FF] text-[#6930B3]">
              2026-27
            </p>
            <p className="text-[8px] lg:text-[10px] font-[600] py-[3px] px-2 rounded-full bg-[#DCFCE6] text-[#16A34A]">
              Active
            </p>
          </div>
        </div>
      </Card>

      {/* Personal Info */}
      <div className="bg-white rounded-xl border border-blue-200 p-[16px] mb-[20px]">
        <h2 className="text-[16px] lg:text-[20px] font-semibold mb-5">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            "Full Name",
            "Date of Birth",
            "Gender",
            "Aadhaar Number",
            "Phone No.",
            "Email Address",
          ].map((label) => (
            <div
              key={label}
              className="border border-blue-200 rounded-lg p-3 bg-blue-50"
            >
              <p className="text-xs lg:text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-[11px] lg:text-[14px] font-[500]">---</p>
            </div>
          ))}
        </div>
        <div className="border border-blue-200 rounded-lg p-3 bg-blue-50 mt-4">
          <p className="text-xs lg:text-sm text-gray-500 mb-1">Address</p>
          <p className="text-[11px] lg:text-[14px] font-[500]">---</p>
        </div>
      </div>
      {/* Class & Subject Allocation */}
      <div className="mb-[20px]">
        <ClassSubjectAllocationTable data={allocations} />
      </div>

      {/* Documents */}
      <div className="bg-white rounded-xl border border-blue-200 p-[20px]">
        <h2 className="text-lg font-semibold mb-4">Uploaded Documents</h2>

        <div className="grid grid-cols-1 gap-4">
          {[
            "Aadhar Card",
            "Previous Marksheet",
            "Birth Certificate",
            "Transfer Certificate",
          ].map((doc) => (
            <div
              key={doc}
              className="flex items-center justify-between border border-blue-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-blue-200">
                  📄
                </div>
                <div>
                  <p className="text-sm font-medium">{doc}</p>
                  <span className="inline-block mt-1 px-2 py-[2px] text-xs font-medium text-blue-600 border border-blue-300 rounded-full">
                    PDF
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm cursor-pointer hover:text-blue-600">
                👁 <span>View</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex w-full p-3 md:p-6">
        <p className="text-[10px] lg:text-[14px] text-[#737373] font-[600] text-center mx-auto">
          If any information is incorrect, please contact the school office for
          assistance.
        </p>
      </div>
    </div>
  );
}
