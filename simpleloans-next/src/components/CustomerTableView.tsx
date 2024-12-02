import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateToMonthDayYear } from "@/utils/formatDateToDateOnly";
import { selectCustomerSchemaType } from "@/zod-schemas/customer";

type Customer = selectCustomerSchemaType;

type Props = {
  customers: Customer[];
  onRowClick: (id: number) => void;
};

export function CustomerTableView({ customers, onRowClick }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Birthday</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow
            key={customer.id}
            onClick={() => onRowClick(customer.id)}
            className="cursor-pointer"
          >
            <TableCell>{customer.id}</TableCell>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell>
              {formatDateToMonthDayYear(customer.birthdate)}
            </TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.notes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
