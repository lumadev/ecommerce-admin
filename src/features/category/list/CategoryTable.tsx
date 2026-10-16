import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Category } from "@/data/categories";
import CategoryRow from "./CategoryRow";

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onRemove: (id: string) => Promise<void> | void;
}

const CategoryTable = ({ categories, onEdit, onRemove }: Props) => {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Hashtags</TableHead>
            <TableHead className="w-16 text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.map((category, index) => (
            <CategoryRow
              key={category.id}
              category={category}
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

export default CategoryTable;
