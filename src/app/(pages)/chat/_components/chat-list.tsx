import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function ChatList() {
  //   Constants
  const mockChats = [
    {
      id: 1,
      heading: "Cosmic Evolution",
      fstMessage:
        "Some 15 billion years ago the universe emerged from a hot, dense sea of...",
      time: "9:34 PM",
    },
    {
      id: 2,
      heading: "AI & The Future",
      fstMessage:
        "Artificial intelligence is transforming the way we interact with technology...",
      time: "8:12 PM",
    },
    {
      id: 3,
      heading: "Quantum Mechanics",
      fstMessage:
        "Quantum theory explains the behavior of matter and energy at the smallest scales...",
      time: "6:45 PM",
    },
    {
      id: 4,
      heading: "Space Exploration",
      fstMessage:
        "Humanity’s journey beyond Earth has only just begun, with Mars as the next goal...",
      time: "5:02 PM",
    },
    {
      id: 5,
      heading: "Cosmic Evolution",
      fstMessage:
        "Some 15 billion years ago the universe emerged from a hot, dense sea of...",
      time: "9:34 PM",
    },
    {
      id: 6,
      heading: "AI & The Future",
      fstMessage:
        "Artificial intelligence is transforming the way we interact with technology...",
      time: "8:12 PM",
    },
    {
      id: 7,
      heading: "Quantum Mechanics",
      fstMessage:
        "Quantum theory explains the behavior of matter and energy at the smallest scales...",
      time: "6:45 PM",
    },
    {
      id: 8,
      heading: "Space Exploration",
      fstMessage:
        "Humanity’s journey beyond Earth has only just begun, with Mars as the next goal...",
      time: "5:02 PM",
    },
    {
      id: 9,
      heading: "Space Exploration",
      fstMessage:
        "Humanity’s journey beyond Earth has only just begun, with Mars as the next goal...",
      time: "5:02 PM",
    },
    {
      id: 10,
      heading: "Space Exploration",
      fstMessage:
        "Humanity’s journey beyond Earth has only just begun, with Mars as the next goal...",
      time: "5:02 PM",
    },
    {
      id: 11,
      heading: "Space Exploration",
      fstMessage:
        "Humanity’s journey beyond Earth has only just begun, with Mars as the next goal...",
      time: "5:02 PM",
    },
    {
      id: 12,
      heading: "Space Exploration",
      fstMessage:
        "Humanity’s journey beyond Earth has only just begun, with Mars as the next goal...",
      time: "5:02 PM",
    },
  ];

  return (
    <>
      {/* <ScrollArea className="h-20 bg-amber-300"> */}
        <ul>
          {mockChats.map((chat) => (
            <li
              key={chat.id}
              className="hover:bg-dark-nutral p-3 rounded-xl cursor-pointer"
            >
              <div className="pb-1.5 flex justify-between items-center">
                <h4 className="font-semibold ">{chat.heading}</h4>
                <span className="text-neutral-400 text-sm opacity-60">
                  {chat.time}
                </span>
              </div>

              <p className="text-sm text-neutral-400">{chat.fstMessage}</p>
            </li>
          ))}
        </ul>
      {/* </ScrollArea> */}
    </>
  );
}
