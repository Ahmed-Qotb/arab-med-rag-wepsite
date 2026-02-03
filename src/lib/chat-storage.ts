export type chat = {
  id: string;
  messages: {
    role: "user" | "ai";
    content: string;
  }[];
};

export type Message = {
  role: "user" | "ai";
  content: string;
};


export function getMessagesByChatId(chatId: string) {
  const chats = JSON.parse(localStorage.getItem("chats") || "[]");

  const chat = chats.find((c: any) => c.id === chatId);

  return chat ? chat.messages : [];
}

export function addMessageByChatId(chatId: string, message: Message) {
  const chats = JSON.parse(localStorage.getItem("chats") || "[]");

  const chatIndex = chats.findIndex((c: any) => c.id === chatId);

  if (chatIndex !== -1) {
    // chat exists → push message
    chats[chatIndex].messages.push(message);
  } else {
    // create new chat
    chats.push({
      id: chatId,
      messages: [message],
    });
  }

  localStorage.setItem("chats", JSON.stringify(chats));
}
