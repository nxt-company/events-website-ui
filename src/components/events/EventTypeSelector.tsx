
import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "@/lib/api-client";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface EventTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function EventTypeSelector({ value, onValueChange }: EventTypeSelectorProps) {
  const {
    data: eventTypes = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ["event-types"],
    queryFn: ApiClient.getEventTypes,
  });

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={isLoading || isError}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select an event type" />
      </SelectTrigger>
      <SelectContent>
        {eventTypes.map((type) => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
