"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusCircle } from "lucide-react";

export function VariableSelector({ variables, onSelectVariable }) {
  const handleVariableClick = (e, variable) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    onSelectVariable(variable);
  };

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Insert Variables</label>
      <div className="flex flex-wrap gap-2">
        {variables.map((variable) => (
          <Button
            key={variable.name}
            variant="outline"
            size="sm"
            type="button"
            onClick={() => onSelectVariable(variable.name)}
            className="flex items-center"
          >
            <PlusCircle className="h-3 w-3 mr-1" />
            {variable.name}
          </Button>
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-3 w-3 mr-1" />
              Custom Variable
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Custom Variables</h4>
                <p className="text-sm text-muted-foreground">
                  Insert custom variables in your template.
                </p>
              </div>
              <div className="grid gap-2">
                {variables.map((variable) => (
                  <div
                    key={variable.name}
                    className="grid grid-cols-3 items-center gap-4"
                  >
                    <span className="text-sm font-medium">{variable.name}</span>
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
      <p className="text-xs text-gray-500 mt-2">
        Variables will be replaced with actual values when the email is sent.
      </p>
    </div>
  );
}
