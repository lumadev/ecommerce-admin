import { useOutletContext } from "react-router-dom";

import { doneTasks, todoTasks } from "./roadmap.data";
import { RoadmapTaskItem } from "./components/RoadmapTaskItem";

const MILI_MERCHANT_CODE = "loja-da-mili";

const RoadmapPage = () => {
  const { merchantCode } = useOutletContext<{ merchantCode?: string }>();

  if (merchantCode !== MILI_MERCHANT_CODE) {
    return (
      <main className="min-h-full bg-background text-foreground">
        <div className="mx-auto max-w-3xl py-10">
          <h1 className="text-xl font-bold">Roadmap exclusivo da Loja da Mili</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Selecione a loja da Mili para acompanhar este roadmap.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-full bg-background text-foreground"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="mx-auto max-w-3xl py-10">
        <h1 className="text-2xl font-bold">Loja da Mili</h1>
        <p className="mt-2 mb-10 text-muted-foreground">
          Acompanhe o que está sendo feito na loja.
        </p>

        <section className="mb-12">
          <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-foreground">
            A fazer
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs">
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
          <h2 className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
            Concluído
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
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
};

export default RoadmapPage;