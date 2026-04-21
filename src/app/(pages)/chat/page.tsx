export default function Page() {
  return (
    <div className="h-full pe-3.5 pb-3.5">
      <div className="h-full flex bg-[#3F424A] rounded-xl flex-col items-center justify-center text-center px-8">
        <h2 className="text-2xl font-semibold mb-2">No Chat Selected</h2>
        <p className="text-sm text-neutral-300 max-w-md">
          Choose a conversation from the left or create a new chat to start
          talking with your assistant.
        </p>
      </div>
    </div>
  );
}

