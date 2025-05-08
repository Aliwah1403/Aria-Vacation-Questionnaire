import {
  Card,
  CardContent,
  CardDescription,
  CardAction,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  TrendingUp,
  TrendingDown,
  Users,
  Download,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MetricCard() {
  return (
    <div
      className=" *:data-[slot=card]:from-neutral-50
       *:data-[slot=card]:to-fountain-blue-50/50 grid grid-cols-4 gap-4  *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 @5xl/main:grid-cols-4"
    >
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center justify-between gap-2">
            Response Rate{" "}
            <CardAction>
              <Badge variant="outline">
                <TrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            78%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Consistent improvement in feedback collection
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            Average Satisfaction{" "}
            <CardAction>
              <Badge variant="outline">
                <TrendingDown />
                -20%
              </Badge>
            </CardAction>
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.3/5
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <TrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Strong guest satisfaction</div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            Pending Responses{" "}
            <CardAction>
              <Badge variant="outline">
                <TrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            12
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            From 42 questionnaires sent
          </div>
          <div className="text-muted-foreground">
            Improved response collection rate
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            Questionnaires Sent{" "}
            <CardAction>
              <Badge variant="outline">
                <TrendingUp />
                +4.5%
              </Badge>
            </CardAction>
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            42
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady distribution increase <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
