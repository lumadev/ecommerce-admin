import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ProductListItem } from "../types/product.types";
import ProductRow from "./ProductRow";

interface Props {
  products: ProductListItem[];
  onEdit: (product: ProductListItem) => void;
  onRemove: (id: string) => Promise<void>;
}

const ProductTable = ({ products, onEdit, onRemove }: Props) => {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead className="text-center">Estoque</TableHead>
            <TableHead className="w-16 text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product, index) => (
            <ProductRow
              key={product.id}
              product={product}
              index={index}
              onEdit={onEdit}
              onRemove={onRemove}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;