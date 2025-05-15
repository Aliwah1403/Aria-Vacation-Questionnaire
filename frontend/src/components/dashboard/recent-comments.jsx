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

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Member",
    company: "Balqis Residence",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=sarah",
    testimonial:
      "Exceptional stay! The staff went above and beyond to make our vacation memorable. The amenities were top-notch and the view was breathtaking.",
  },
  {
    name: "Michael Chen",
    role: "Member",
    company: "Balqis Residence",
    rating: 4,
    image: "https://i.pravatar.cc/150?u=michael",
    testimonial:
      "Great experience overall. The room service was prompt and the facilities were well-maintained. Would recommend to others.",
  },
  {
    name: "Elena Rodriguez",
    role: "Member",
    company: "Balqis Residence",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=elena",
    testimonial:
      "Perfect family getaway! The kids loved the pool area and the staff was incredibly accommodating to our needs.",
  },
  {
    name: "Ahmed Hassan",
    role: "Member",
    company: "Balqis Residence",
    rating: 4,
    image: "https://i.pravatar.cc/150?u=ahmed",
    testimonial:
      "The staff at Balqis Residence were exceptional. They went above and beyond to make our stay memorable. The facilities were immaculate and the views were breathtaking.",
  },
  {
    name: "Lisa Thompson",
    role: "Member",
    company: "Balqis Residence",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=lisa",
    testimonial:
      "Beautiful resort with amazing amenities. The room was spacious and comfortable. Would definitely recommend to friends and family.",
  },
  {
    name: "Viktor Petrov",
    role: "Member",
    company: "Balqis Residence",
    rating: 3,
    image: "https://i.pravatar.cc/150?u=viktor",
    testimonial:
      "Good location and friendly staff. Some areas could use updating, but overall a pleasant stay.",
  },
  {
    name: "Maria Santos",
    role: "Member",
    company: "Balqis Residence",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=maria",
    testimonial:
      "The concierge service was exceptional. They made our anniversary celebration truly special.",
  },
  {
    name: "James Wilson",
    role: "Member",
    company: "Balqis Residence",
    rating: 4,
    image: "https://i.pravatar.cc/150?u=james",
    testimonial:
      "Clean, comfortable, and convenient. The beach access and water activities were highlights of our stay.",
  },
  {
    name: "Yuki Tanaka",
    role: "Member",
    company: "Balqis Residence",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=yuki",
    testimonial:
      "Impeccable service and beautiful surroundings. The restaurant offerings were diverse and delicious.",
  },
  {
    name: "Robert Miller",
    role: "Member",
    company: "Balqis Residence",
    rating: 4,
    image: "https://i.pravatar.cc/150?u=robert",
    testimonial:
      "Very relaxing atmosphere and professional staff. The gym facilities were well-equipped and modern.",
  },
];

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
              {/* <CarouselItem className="basis-1/3 pl-4">
                <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                  2
                </div>
              </CarouselItem>
              <CarouselItem className="basis-1/3 pl-4">
                <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                  3
                </div>
              </CarouselItem>
              <CarouselItem className="basis-1/3 pl-4">
                <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                  4
                </div>
              </CarouselItem>
              <CarouselItem className="basis-1/3 pl-4">
                <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                  5
                </div>
              </CarouselItem>
              <CarouselItem className="basis-1/3 pl-4">
                <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                  6
                </div>
              </CarouselItem>
              <CarouselItem className="basis-1/3 pl-4">
                <div className="flex aspect-square items-center justify-center border border-zinc-200 dark:border-zinc-800">
                  7
                </div>
              </CarouselItem> */}
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
