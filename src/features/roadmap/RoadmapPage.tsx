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
  const [isTodoExpanded, setIsTodoExpanded] = useState(true);
  const [isDoneExpanded, setIsDoneExpanded] = useState(true);
  const [areNextStepsExpanded, setAreNextStepsExpanded] = useState(true);

  if (merchantCode !== MILI_MERCHANT_CODE) {
    return (
      <main className="min-h-full bg-background text-foreground">
        <div className="mx-auto max-w-4xl py-10">
          <h1 className="text-xl font-bold">Roadmap exclusivo da Loja da Mili</h1>
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
    <main
      className="-mx-6 -my-6 min-h-full bg-gradient-hero px-4 py-8 text-foreground sm:px-6 sm:py-10"
      style={{ fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="mx-auto max-w-4xl">
        {/* <header className="mb-8 overflow-hidden rounded-3xl border border-white/70 bg-card px-6 py-7 shadow-glow sm:px-8 sm:py-9">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary-foreground">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Acompanhamento do projeto
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Loja da Mili
          </h1>
          <p className="mt-2 max-w-xl text-base text-muted-foreground">
            Acompanhe o progresso do projeto.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              {todoTasks.length} itens a fazer
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800">
              <Check className="h-4 w-4" aria-hidden="true" />
              {doneTasks.length} concluídos
            </div>
          </div>
        </header> */}

        <div className="mb-7 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <label
            htmlFor="roadmap-search"
            className="mb-2 block text-sm font-bold text-foreground"
          >
            Buscar itens do roadmap
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
              placeholder="Digite o nome ou a descrição de um item..."
              className="pl-9"
            />
          </div>
        </div>

        <section className="mb-7 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-5 sm:p-6">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-amber-900">
            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 ${
                isTodoExpanded ? "mb-4" : ""
              }`}
              aria-expanded={isTodoExpanded}
              aria-controls="roadmap-todo-list"
              onClick={() => setIsTodoExpanded((expanded) => !expanded)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <ClipboardList className="h-5 w-5" aria-hidden="true" />
              </span>
              A fazer
              <span className="rounded-full bg-amber-200 px-2.5 py-1 text-xs font-bold text-amber-900">
                {filteredTodoTasks.length}
              </span>
              <ChevronDown
                className={`ml-auto h-5 w-5 transition-transform ${
                  isTodoExpanded ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          </h2>
          <ul
            id="roadmap-todo-list"
            className="space-y-3"
            hidden={!isTodoExpanded}
          >
            {filteredTodoTasks.map((task) => (
              <RoadmapTaskItem key={task.id} task={task} />
            ))}
            {filteredTodoTasks.length === 0 && (
              <li className="rounded-xl border border-dashed border-amber-300 bg-white/60 p-4 text-sm text-muted-foreground">
                Nenhum item a fazer corresponde à busca.
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-5 sm:p-6">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-emerald-900">
            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 ${
                isDoneExpanded ? "mb-4" : ""
              }`}
              aria-expanded={isDoneExpanded}
              aria-controls="roadmap-done-list"
              onClick={() => setIsDoneExpanded((expanded) => !expanded)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Check className="h-5 w-5" aria-hidden="true" />
              </span>
              Concluído
              <span className="rounded-full bg-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-900">
                {filteredDoneTasks.length}
              </span>
              <ChevronDown
                className={`ml-auto h-5 w-5 transition-transform ${
                  isDoneExpanded ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          </h2>
          <ul
            id="roadmap-done-list"
            className="space-y-3"
            hidden={!isDoneExpanded}
          >
            {filteredDoneTasks.map((task) => (
              <RoadmapTaskItem key={task.id} task={task} done />
            ))}
            {filteredDoneTasks.length === 0 && (
              <li className="rounded-xl border border-dashed border-emerald-300 bg-white/60 p-4 text-sm text-muted-foreground">
                Nenhum item concluído corresponde à busca.
              </li>
            )}
          </ul>
        </section>

        <section className="mt-7 rounded-2xl border border-violet-200/80 bg-violet-50/70 p-5 sm:p-6">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-violet-900">
            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700 focus-visible:ring-offset-2 ${
                areNextStepsExpanded ? "mb-4" : ""
              }`}
              aria-expanded={areNextStepsExpanded}
              aria-controls="roadmap-next-steps-list"
              onClick={() =>
                setAreNextStepsExpanded((expanded) => !expanded)
              }
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              Próximos passos
              <span className="rounded-full bg-violet-200 px-2.5 py-1 text-xs font-bold text-violet-900">
                {filteredNextStepTasks.length}
              </span>
              <ChevronDown
                className={`ml-auto h-5 w-5 transition-transform ${
                  areNextStepsExpanded ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          </h2>
          <div
            id="roadmap-next-steps-list"
            hidden={!areNextStepsExpanded}
          >
            <p className="mb-4 text-sm text-violet-800">
              Próximas tarefas para a Mili desenvolver com vibe code.
            </p>
            <ul className="space-y-3">
              {filteredNextStepTasks.map((task) => (
                <RoadmapTaskItem key={task.id} task={task} />
              ))}
              {filteredNextStepTasks.length === 0 && (
                <li className="rounded-xl border border-dashed border-violet-300 bg-white/60 p-4 text-sm text-muted-foreground">
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