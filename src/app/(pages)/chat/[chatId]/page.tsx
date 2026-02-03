import MainChat from "../_components/main-chat";

export default async function Page({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  console.log(chatId);

  return (
    <>
      <MainChat chatId={chatId} />
    </>
  );
}
