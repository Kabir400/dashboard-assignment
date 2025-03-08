import { Loader } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white">
      <Loader className="h-14 w-14 animate-spin text-gray-500" />
    </div>
  );
}
