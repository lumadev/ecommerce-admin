import { doneTasks, todoTasks } from "./roadmap.data";
import { RoadmapTaskItem } from "./components/RoadmapTaskItem";

const RoadmapPage = () => (
  <main
    className="min-h-screen bg-white"
    style={{ fontFamily: "'Nunito', sans-serif" }}
  >
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="mt-3 text-slate-400 py-8">
        Milii BabyStore - Acompanhe o que está sendo feito na loja.
      </p>

      <section className="mb-14">
        <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-500">
          A fazer
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs">
            {todoTasks.length}
          </span>
        </h2>
        <ul className="space-y-3">
          {todoTasks.map((task) => (
            <RoadmapTaskItem key={task.id} task={task} />
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-emerald-500">
          Concluído
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs">
            {doneTasks.length}
          </span>
        </h2>
        <ul className="space-y-3">
          {doneTasks.map((task) => (
            <RoadmapTaskItem key={task.id} task={task} done />
          ))}
        </ul>
      </section>
    </div>
  </main>
);

export default RoadmapPage;
