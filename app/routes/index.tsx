import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => ({
  title: "Home",
});

export default function Index() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl">Hello this is test site</h1>
      <img src="https://placekitten.com/600/400" alt="" />
    </div>
  );
}
