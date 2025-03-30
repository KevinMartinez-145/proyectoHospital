import { useState } from "react";
import { Button } from "./components/ui/button";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="p-8 bg-gray-800 rounded-2xl shadow-lg text-center">
      <h1 className="text-2xl font-semibold text-white mb-4">Tailwind + ShadCN Setup :&#41;</h1>
        <h2 className="text-1xl font-semibold text-white mb-4">Counter App</h2>

        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={() => setCount((prev) => prev - 1)}
            className="bg-red-600 hover:bg-red-700 transition-all px-6 py-2 rounded-lg"
          >
            -
          </Button>

          <span className="text-3xl font-bold text-white">{count}</span>

          <Button
            onClick={() => setCount((prev) => prev + 1)}
            className="bg-green-600 hover:bg-green-700 transition-all px-6 py-2 rounded-lg"
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
