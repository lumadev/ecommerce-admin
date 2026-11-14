import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { ProductListItem } from "../types/product.types";
import ProductRow from "./ProductRow";
import ProductCard from "./ProductCard";

interface Props {
  products: ProductListItem[];
  onEdit: (product: ProductListItem) => void;
  onHistory: (product: ProductListItem) => void;
  onRemove: (id: string) => Promise<void>;
}

const ProductTable = ({ products, onEdit, onHistory, onRemove }: Props) => {
  return (
    <>
      <div className="space-y-3 lg:hidden">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            onEdit={onEdit}
            onHistory={onHistory}
            onRemove={onRemove}
          />
        ))}
      </div>

      <div className="hidden rounded-lg border bg-card lg:block">
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
                onHistory={onHistory}
                onRemove={onRemove}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ProductTable;