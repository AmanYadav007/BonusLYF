export function ChatMessageSkeleton({ isUser = false }: { isUser?: boolean }) {
  return (
    <div className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse shrink-0" />
      )}
      <div className={`space-y-2 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`h-10 rounded-2xl bg-white/10 animate-pulse ${
            isUser ? "w-48 rounded-br-sm" : "w-64 rounded-bl-sm"
          }`}
        />
        {Math.random() > 0.5 && (
          <div
            className={`h-4 rounded-full bg-white/5 animate-pulse ${
              isUser ? "w-32" : "w-40"
            }`}
          />
        )}
      </div>
    </div>
  );
}

export function ChatLoadingState() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <ChatMessageSkeleton isUser={false} />
      <ChatMessageSkeleton isUser={true} />
      <ChatMessageSkeleton isUser={false} />
      <ChatMessageSkeleton isUser={true} />
      <ChatMessageSkeleton isUser={false} />
    </div>
  );
}
