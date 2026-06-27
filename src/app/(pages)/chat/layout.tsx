import SideChat from "./_components/side-chat";

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-12 w-full gap-3.5">
      <div className="col-span-9">{children}</div>
      <div className="col-span-3">
        <SideChat />
      </div>
    </div>
  );
}
