import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselItem,
} from "@/components/ui/carousel";
import { Testimonial } from "../testimonial-card";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const RecentComments = ({ comments }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Comments</CardTitle>
        <CardDescription>Approved comments for testimonials</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full px-4">
          <Carousel>
            <CarouselNavigation
              className=" -top-10 left-auto bottom-auto w-full justify-end gap-2"
              classNameButton="bg-fountain-blue-400 *:stroke-zinc-50 dark:bg-zinc-200 dark:*:stroke-zinc-800"
              alwaysShow
            />
            <CarouselContent className="-ml-4">
              {comments.map((testimonial) => (
                <CarouselItem
                  key={testimonial.name}
                  className="basis-1/3 pl-4 h-full"
                >
                  <div className="h-full">
                    <Testimonial
                      {...testimonial}
                      name={testimonial.name}
                      testimonial={testimonial.comment}
                      rating={testimonial.rating}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={"/admin/questionnaires"}>
          <Button variant="ghost" className="text-fountain-blue-400">
            View All Feedback Responses
            <ArrowRight className=" size-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentComments;
