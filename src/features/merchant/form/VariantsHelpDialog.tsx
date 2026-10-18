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
        className="rounded-full p-1 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <CircleHelp size={16} />
      </button>
    </DialogTrigger>
    <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Como funcionam as variantes</DialogTitle>
        <DialogDescription>
          Variantes são as características que aparecem no cadastro e na edição
          de produtos, como Tamanho, Cor ou Material.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 text-sm">
        <section className="space-y-1">
          <h3 className="font-medium">Tipo</h3>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Lista de opções:</strong> o
              produto recebe um ou mais valores pré-definidos (ex: P, M, G). As
              opções são gerenciadas na página Variantes.
            </li>
            <li>
              <strong className="text-foreground">Texto livre:</strong> o valor
              é digitado manualmente em cada produto (ex: Composição).
            </li>
          </ul>
        </section>

        <section className="space-y-1">
          <h3 className="font-medium">Obrigatória ou não obrigatória</h3>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Obrigatória:</strong> o
              produto só pode ser salvo com a variante preenchida.
            </li>
            <li>
              <strong className="text-foreground">Não obrigatória:</strong> o
              preenchimento é opcional.
            </li>
          </ul>
        </section>

        <section className="space-y-1">
          <h3 className="font-medium">Boas práticas</h3>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Use nomes curtos e no singular (ex: Tamanho, não Tamanhos).</li>
            <li>
              Marque como obrigatória só o que é essencial para vender o
              produto.
            </li>
            <li>
              Variantes em uso por produtos não podem ser removidas; altere os
              produtos antes.
            </li>
            <li>
              Alterar a obrigatoriedade vale para os próximos cadastros e
              edições de produto.
            </li>
            <li>As alterações só são aplicadas ao clicar em Salvar alterações.</li>
          </ul>
        </section>
      </div>
    </DialogContent>
  </Dialog>
);

export default VariantsHelpDialog;
