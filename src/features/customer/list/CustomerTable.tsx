import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Customer } from "../types/customer.types";
import CustomerRow from "./CustomerRow";

interface Props {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onRemove: (id: string) => Promise<void> | void;
}

const CustomerTable = ({ customers, onEdit, onRemove }: Props) => (
  <div className="rounded-lg border border-border bg-card">
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Nome</TableHead>
          <TableHead>E-mail</TableHead>
          <TableHead>Cadastro</TableHead>
          <TableHead className="w-24 text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {customers.map((customer, index) => (
          <CustomerRow
            key={customer.id}
            customer={customer}
            index={index}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        ))}
      </TableBody>
    </Table>
  </div>
);

export default CustomerTable;
