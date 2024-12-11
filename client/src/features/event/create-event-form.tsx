import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CreateEventType,
  FormSchema,
  createEventSchema,
  useCreateEvent,
} from "./api/create-event";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface CreateEventFormProp {
  communityId: string;
  userId: string | undefined;
  submitCallback: () => void;
}

export const CreateEventForm = ({
  communityId,
  userId,
  submitCallback,
}: CreateEventFormProp) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      name: "",
      tags: "",
    },
  });
  const { mutate: createEvent } = useCreateEvent({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Event created successfully!");
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          console.log(error.response);
        }
      },
    },
  });

  function onSubmit(values: FormSchema) {
    console.log(values);

    const formattedValues = {
      ...values,
      tags: values?.tags?.replace(" ", "").split(","),
      communityId,
      createdBy: userId,
    };

    createEvent(formattedValues as CreateEventType);
    submitCallback();
    // toast({
    //   title: 'Event created',
    //   name: 'Your event has been successfully created.',
    // })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 text-primary-foreground"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Event name" {...field} />
              </FormControl>
              <FormDescription>
                Provide a brief name of the event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of event</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-[240px] pl-3 text-left font-normal ${
                        !field.value && "text-muted-foreground"
                      }`}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 dark:border-none"
                  align="start"
                >
                  <Calendar
                    className="bg-primary rounded-md"
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the date when the event will take place.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="Comma-separated tags" {...field} />
              </FormControl>
              <FormDescription>
                Add tags to categorize your event (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="text-sm text-accent-foreground" type="submit">
          Create Event
        </Button>
      </form>
    </Form>
  );
};
