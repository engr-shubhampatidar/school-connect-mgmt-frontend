import ClassOverviewContainer from "@/components/admin/ClassOverviewContainer";

export const metadata = {
  title: "Class Overview",
};

export default function Page() {
  return (
    <main className="p-8 mx-auto">
      <ClassOverviewContainer />
    </main>
  );
}
