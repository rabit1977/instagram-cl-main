import SideNav from "@/components/SideNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen relative flex-col md:flex-row md:overflow-hidden ">
      <div className="hidden md:flex lg:w-64 2xl:w-80 border-r">
        <SideNav />
      </div>
      <div className="flex-grow mt-8 flex-1 w-full md:overflow-y-auto no-scrollbar ">
        {children}
      </div>
    </div>
  );
}
