import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => ({
  title: "Profile",
});

export default function Profile() {
  return (
    <div className="flex justify-center">
      <h1 className="text-2xl">This is a profile page</h1>
    </div>
  );
}
