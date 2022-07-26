import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => ({
  title: "Dashboard",
});

export default function Dashboard() {
  return (
    <div className="flex justify-center">
      <h1 className="text-2xl">This is a dashboard page</h1>
    </div>
  );
}
