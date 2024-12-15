import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "@/components/ui/badge";

export type HealthItem = {
  title: string;
  message: string;
  status: "red" | "yellow" | "green";
};

export interface LoanDashboardHealthItemProps {
  index: string;
  healthItem: HealthItem;
}

export function LoanDashboardHealthItem({
  index,
  healthItem,
}: LoanDashboardHealthItemProps) {
  const getStatusColor = (status: "red" | "yellow" | "green") => {
    switch (status) {
      case "red":
        return "bg-red-100 text-red-800 border-red-300";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "green":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  const getStatusIcon = (status: "red" | "yellow" | "green") => {
    switch (status) {
      case "red":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "yellow":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "green":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      default:
        return null;
    }
  };
  const getStatusName = (status: "red" | "yellow" | "green") => {
    switch (status) {
      case "red":
        return "Error";
      case "yellow":
        return "Warning";
      case "green":
        return "Success";
      default:
        return "Info";
    }
  };
  return (
    <Card key={index} className={`border ${getStatusColor(healthItem.status)}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          {getStatusIcon(healthItem.status)}
          <Badge variant="outline" className="capitalize">
            {getStatusName(healthItem.status)}
          </Badge>
        </div>
        <h3 className="font-semibold text-sm">{healthItem.title}</h3>
        <h2 className="text-lg font-semibold">{healthItem.message}</h2>
      </CardContent>
    </Card>
  );
}
