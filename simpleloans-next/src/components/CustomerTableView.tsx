import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { customers } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

type Customer = InferSelectModel<typeof customers>;

export function CustomerTableView({ customers }: { customers: Customer[] }) {
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
            // onClick={() => handleRowClick(customer.id)}
            className="cursor-pointer"
          >
            <TableCell>{customer.id}</TableCell>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell>{customer.birthdate.toString()}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.notes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
