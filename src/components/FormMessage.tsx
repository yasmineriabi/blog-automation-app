interface FormMessageProps {
  message: string;
  type?: "error" | "success";
}

export default function FormMessage({
  message,
  type = "error",
}: FormMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`text-center text-sm p-3 rounded-lg ${
        type === "error"
          ? "text-destructive bg-destructive/10 border border-destructive/20"
          : "text-success bg-success/10 border border-success/20"
      }`}
    >
      {message}
    </div>
  );
}
