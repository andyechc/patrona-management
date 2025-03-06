function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <p className="w-full bg-red-500 px-2 rounded font-bold text-red-200 z-30">
      {error}
    </p>
  );
}

export default ErrorMessage;
