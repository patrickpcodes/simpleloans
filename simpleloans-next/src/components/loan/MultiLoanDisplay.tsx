import { LoanDetail } from "@/types/LoanDetail";
import { DetailedLoanDisplay } from "./DetailedLoanDisplay";
import { ModernLoanDisplay } from "./ModernLoanDisplay";
import { SimpleLoanDisplay } from "./SimpleLoanDisplay";

export function MultiLoanDisplay({
  loanDetails,
  onRowClick,
}: {
  loanDetails: LoanDetail[];
  onRowClick: (id: number) => void;
}) {
  return (
    <div>
      {loanDetails.length > 0 && (
        <div className="py-1 my-4">
          <div className="h-px bg-gray-300 w-full my-4" />
          <h1 className="text-4xl font-bold">Loan Format : Simple</h1>
          <div className="grid grid-cols-2 gap-2 my-2">
            {loanDetails.map((loanDetail) => (
              <SimpleLoanDisplay
                key={loanDetail.loan.id}
                loanDetail={loanDetail}
                onRowClick={onRowClick}
              />
            ))}
          </div>
        </div>
      )}
      {loanDetails.length > 0 && (
        <div className="py-1 my-4">
          <div className="h-px bg-gray-300 w-full my-4" />
          <h1 className="text-4xl font-bold">Loan Format : Detailed</h1>
          <div className="grid grid-cols-2 gap-2 my-2">
            {loanDetails.map((loanDetail) => (
              <DetailedLoanDisplay
                key={loanDetail.loan.id}
                loanDetail={loanDetail}
                onRowClick={onRowClick}
              />
            ))}
          </div>
        </div>
      )}
      {loanDetails.length > 0 && (
        <div className="py-1 my-4">
          <div className="h-px bg-gray-300 w-full my-4" />
          <h1 className="text-4xl font-bold">Loan Format : Modern</h1>
          <div className="grid grid-cols-2 gap-2 my-2">
            {loanDetails.map((loanDetail) => (
              <ModernLoanDisplay
                key={loanDetail.loan.id}
                loanDetail={loanDetail}
                onRowClick={onRowClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
