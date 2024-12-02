import { CustomerDetail } from "@/types/CustomerDetail";
import { SimpleCustomerDisplay } from "./SimpleCustomerDisplay";
import { DetailedCustomerDisplay } from "./DetailedCustomerDisplay";
import { ModernCustomerDisplay } from "./ModernCustomerDisplay";

export function MultiCustomerDisplay({
  customerDetails,
  onRowClick,
}: {
  customerDetails: CustomerDetail[];
  onRowClick: (id: number) => void;
}) {
  return (
    <div>
      {customerDetails.length > 0 && (
        <div className="py-1 my-4">
          <div className="h-px bg-gray-300 w-full my-4" />
          <h1 className="text-4xl font-bold">Customer Format : Simple</h1>
          <div className="grid grid-cols-2 gap-2 my-2">
            {customerDetails.map((customerDetail) => (
              <SimpleCustomerDisplay
                key={customerDetail.customer.id}
                customerDetail={customerDetail}
                onRowClick={onRowClick}
              />
            ))}
          </div>
        </div>
      )}
      {customerDetails.length > 0 && (
        <div className="py-1 my-4">
          <div className="h-px bg-gray-300 w-full my-4" />
          <h1 className="text-4xl font-bold">Customer Format : Detailed</h1>
          <div className="grid grid-cols-2 gap-2 my-2">
            {customerDetails.map((customerDetail) => (
              <DetailedCustomerDisplay
                key={customerDetail.customer.id}
                customerDetail={customerDetail}
                onRowClick={onRowClick}
              />
            ))}
          </div>
        </div>
      )}
      {customerDetails.length > 0 && (
        <div className="py-1 my-4">
          <div className="h-px bg-gray-300 w-full my-4" />
          <h1 className="text-4xl font-bold">Customer Format : Modern</h1>
          <div className="grid grid-cols-2 gap-2 my-2">
            {customerDetails.map((customerDetail) => (
              <ModernCustomerDisplay
                key={customerDetail.customer.id}
                customerDetail={customerDetail}
                onRowClick={onRowClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
