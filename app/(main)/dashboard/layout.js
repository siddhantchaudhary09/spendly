import { Suspense } from "react";
import { BarLoader } from "react-spinners";
import Dashboard from "./page";

const DashboardLayout = () => {
  return (
    <div className="px-5">
      <h1 className="text-6xl font-bold gradient-title mb-5">Dashboard</h1>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} height={"100%"} />}
      >
        <Dashboard />
      </Suspense>
    </div>
  );
};

export default DashboardLayout;
