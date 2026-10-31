import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";

interface NoCategoriesNoticeProps {
  onNavigate: () => void;
}

const NoCategoriesNotice = ({ onNavigate }: NoCategoriesNoticeProps) => (
  <Alert>
    <Info className="h-4 w-4" />
    <AlertTitle>Nenhuma categoria cadastrada</AlertTitle>
    <AlertDescription>
      <Link
        to="/categorias"
        onClick={onNavigate}
        className="font-medium text-primary underline underline-offset-4"
      >
        Clique aqui para cadastrar categorias de produtos.
      </Link>
    </AlertDescription>
  </Alert>
);

export default NoCategoriesNotice;
