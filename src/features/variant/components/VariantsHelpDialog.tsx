import { CircleHelp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

const VariantsHelpDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <button
        type="button"
        aria-label="Como funcionam as variantes"
        className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <CircleHelp size={16} className="text-muted-foreground" />
        <span className="hidden sm:inline">Como funcionam</span>
      </button>
    </DialogTrigger>
    <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Como funcionam as variantes</DialogTitle>
        <DialogDescription>
          Variantes descrevem características de um produto, como Tamanho, Cor
          ou Material. Elas ajudam o lojista a informar detalhes importantes e
          permitem que o cliente compare as opções disponíveis.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 text-sm">
        <section className="space-y-1">
          <h3 className="font-medium">Tipo</h3>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Lista de opções:</strong> os
              valores são cadastrados aqui e escolhidos no produto (ex: P, M,
              G). Use quando há opções padronizadas.
            </li>
            <li>
              <strong className="text-foreground">Texto livre:</strong> o valor
              é digitado no cadastro de cada produto (ex: Composição). Não há
              uma lista para gerenciar.
            </li>
          </ul>
        </section>

        <section className="space-y-1">
          <h3 className="font-medium">Obrigatoriedade</h3>
          <p className="text-muted-foreground">
            Variantes obrigatórias precisam ser preenchidas para salvar o
            produto. As não obrigatórias podem ficar em branco. Marque como
            obrigatória apenas uma informação essencial para apresentar ou
            vender o produto.
          </p>
        </section>

        <section className="space-y-1">
          <h3 className="font-medium">Quando usar</h3>
          <p className="text-muted-foreground">
            Cadastre variantes para organizar informações que mudam entre
            produtos e deixar esses detalhes claros para quem está comprando.
            Alterações na configuração valem para os cadastros e edições de
            produtos.
          </p>
        </section>
      </div>
    </DialogContent>
  </Dialog>
);

export default VariantsHelpDialog;