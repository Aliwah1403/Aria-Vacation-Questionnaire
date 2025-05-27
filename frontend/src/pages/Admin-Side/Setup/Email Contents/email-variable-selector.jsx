import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusCircle, Info } from "lucide-react";

export function VariableSelector({ variables, onSelectVariable }) {
  const handleVariableClick = (e, variable) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    onSelectVariable(variable);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm font-medium">Insert Variables</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-5 w-5">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Variable definitions</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">
                  Variable Definitions
                </h4>
                <p className="text-sm text-muted-foreground">
                  These variables will be replaced with actual values when the
                  email is sent.
                </p>
              </div>
              <div className="grid gap-2">
                {variables.map((variable) => (
                  <div
                    key={variable.name}
                    className="flex justify-between items-center gap-4"
                  >
                    <span className="text-sm font-medium">{`{{${variable.name}}}`}</span>
                    <span className="col-span-2 text-xs text-gray-500">
                      {variable.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-wrap gap-2">
        {variables.map((variable) => (
          <Button
            key={variable.name}
            variant="outline"
            size="sm"
            type="button"
            onClick={(e) => handleVariableClick(e, variable.name)}
            className="flex items-center"
          >
            <PlusCircle className="h-3 w-3 mr-1" />
            {variable.name}
          </Button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Variables will be replaced with actual values when the email is sent.
      </p>
    </div>
  );
}
