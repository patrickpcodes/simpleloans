import { History } from "@/types/History";
import { CalendarIcon, UserIcon } from "lucide-react";

interface HistoryTimelineViewProps {
  history: History[];
}

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);

  // Format with the user's local timezone
  return new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // 24-hour time format
  }).format(date);
};

export function HistoryTimelineView({ history }: HistoryTimelineViewProps) {
  return (
    <div className="max-w-2xl mx-auto pt-4">
      <h2 className="text-2xl font-bold mb-4">{history[0].type} History</h2>
      <div className="space-y-6">
        {history.map((item, index) => (
          <div key={index} className="relative pl-8 pb-6">
            <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200"></div>
            <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center -ml-3">
              <CalendarIcon className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center mb-2">
                <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-semibold">
                  Changes made by: {item.displayName}
                </span>
                <span className="ml-auto text-sm text-gray-500">
                  {formatDateTime(item.timestamp)}
                </span>
              </div>
              <div className="space-y-2">
                {item.changes.map((change, changeIndex) => (
                  <div key={changeIndex} className="text-sm">
                    <span className="font-medium">{change.field}:</span>
                    <span className="line-through text-red-500 ml-2">
                      {change.oldValue}
                    </span>
                    <span className="text-green-500 ml-2">
                      {change.newValue}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
