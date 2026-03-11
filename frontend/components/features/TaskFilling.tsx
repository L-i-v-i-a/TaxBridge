import TaskFilling from "../features/TaskFilling";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0D23AD] flex flex-col items-center justify-center p-6">
      {/* Ensure text is inside a tag for proper typography and color */}
      <h1 className="text-white text-4xl md:text-6xl font-bold text-center max-w-4xl">
        Tax filing shouldn’t be stressful or confusing
      </h1>
      
      {/* Your imported component */}
      <TaskFilling />
    </main>
  );
}