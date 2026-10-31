import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Check,
  ChevronDown,
  ClipboardList,
  Search,
  Sparkles,
} from "lucide-react";

import { Input } from "@/shared/components/ui/input";
import { doneTasks, nextStepTasks, todoTasks } from "./roadmap.data";
import { RoadmapTaskItem } from "./components/RoadmapTaskItem";

const MILI_MERCHANT_CODE = "milii-babystore";

const normalizeSearchText = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");

const RoadmapPage = () => {
  const { merchantCode } = useOutletContext<{ merchantCode?: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [isTodoExpanded, setIsTodoExpanded] = useState(false);
  const [isDoneExpanded, setIsDoneExpanded] = useState(false);
  const [areNextStepsExpanded, setAreNextStepsExpanded] = useState(true);

  if (merchantCode !== MILI_MERCHANT_CODE) {
    return (
      <main className="min-h-full bg-background text-foreground">
        <div className="mx-auto max-w-4xl py-10">
          <h1 className="font-display text-xl font-bold">
            Roadmap exclusivo da Loja da Mili
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Selecione a loja da Mili para acompanhar este roadmap.
          </p>
        </div>
      </main>
    );
  }

  const normalizedSearchTerm = normalizeSearchText(searchTerm.trim());
  const filterTasks = (tasks: typeof todoTasks) =>
    tasks.filter((task) =>
      normalizeSearchText(`${task.title} ${task.note ?? ""}`).includes(
        normalizedSearchTerm
      )
    );
  const filteredTodoTasks = filterTasks(todoTasks);
  const filteredDoneTasks = filterTasks(doneTasks);
  const filteredNextStepTasks = filterTasks(nextStepTasks);

  return (
    <main className="-mx-6 -my-6 min-h-full bg-background px-4 py-6 text-foreground sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Acompanhamento do projeto
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Roadmap da Mili
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Progresso e próximos passos do projeto em um só lugar.
            </p>
          </div>
          <div className="w-full lg:max-w-sm">
            <label
              htmlFor="roadmap-search"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Buscar no roadmap
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="roadmap-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Nome ou descrição..."
                className="h-10 border-border bg-background pl-9"
              />
            </div>
          </div>
        </header>

        <div className="mb-5 grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <h2 className="text-base font-bold text-foreground">
              <button
                type="button"
                className={`flex w-full items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isTodoExpanded ? "mb-4" : ""
                }`}
                aria-expanded={isTodoExpanded}
                aria-controls="roadmap-todo-list"
                onClick={() => setIsTodoExpanded((expanded) => !expanded)}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-primary">
                  <ClipboardList className="h-5 w-5" aria-hidden="true" />
                </span>
                A fazer
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
                  {filteredTodoTasks.length}
                </span>
                <ChevronDown
                  className={`ml-auto h-5 w-5 text-muted-foreground transition-transform ${
                    isTodoExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h2>
            <ul
              id="roadmap-todo-list"
              className="grid gap-3 sm:grid-cols-2"
              hidden={!isTodoExpanded}
            >
              {filteredTodoTasks.map((task) => (
                <RoadmapTaskItem key={task.id} task={task} />
              ))}
              {filteredTodoTasks.length === 0 && (
                <li className="rounded-xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground sm:col-span-2">
                  Nenhum item a fazer corresponde à busca.
                </li>
              )}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <h2 className="text-base font-bold text-foreground">
              <button
                type="button"
                className={`flex w-full items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isDoneExpanded ? "mb-4" : ""
                }`}
                aria-expanded={isDoneExpanded}
                aria-controls="roadmap-done-list"
                onClick={() => setIsDoneExpanded((expanded) => !expanded)}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Check className="h-5 w-5" aria-hidden="true" />
                </span>
                Concluído
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
                  {filteredDoneTasks.length}
                </span>
                <ChevronDown
                  className={`ml-auto h-5 w-5 text-muted-foreground transition-transform ${
                    isDoneExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
            </h2>
            <ul
              id="roadmap-done-list"
              className="grid gap-3 sm:grid-cols-2"
              hidden={!isDoneExpanded}
            >
              {filteredDoneTasks.map((task) => (
                <RoadmapTaskItem
                  key={task.id}
                  task={task}
                  variant="done"
                />
              ))}
              {filteredDoneTasks.length === 0 && (
                <li className="rounded-xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground sm:col-span-2">
                  Nenhum item concluído corresponde à busca.
                </li>
              )}
            </ul>
          </section>
        </div>

        <section className="overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-sm">
          <h2 className="border-b border-border bg-muted/40 p-4 text-base font-bold text-foreground sm:p-5">
            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                areNextStepsExpanded ? "mb-4" : ""
              }`}
              aria-expanded={areNextStepsExpanded}
              aria-controls="roadmap-next-steps-list"
              onClick={() =>
                setAreNextStepsExpanded((expanded) => !expanded)
              }
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              Próximos passos
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                {filteredNextStepTasks.length}
              </span>
              <ChevronDown
                className={`ml-auto h-5 w-5 text-muted-foreground transition-transform ${
                  areNextStepsExpanded ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          </h2>
          <div
            id="roadmap-next-steps-list"
            className="p-4 sm:p-5"
            hidden={!areNextStepsExpanded}
          >
            <p className="mb-4 text-sm text-muted-foreground">
              Próximas tarefas para a Mili desenvolver com vibe code.
            </p>
            <ul className="grid gap-3 md:grid-cols-2">
              {filteredNextStepTasks.map((task) => (
                <RoadmapTaskItem
                  key={task.id}
                  task={task}
                  variant="nextStep"
                />
              ))}
              {filteredNextStepTasks.length === 0 && (
                <li className="rounded-xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground md:col-span-2">
                  Nenhum próximo passo corresponde à busca.
                </li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
};

export default RoadmapPage;
