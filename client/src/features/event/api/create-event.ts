import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const createEventSchema = z.object({
  name: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  eventDate: z.date({
    required_error: "A date of event is required.",
  }),
  tags: z.string().optional(),
});

export type FormSchema = z.infer<typeof createEventSchema>;

export type CreateEventType = z.infer<typeof createEventSchema> & {
  createdBy: string;
  communityId: string;
};

const createEvent = async (data: CreateEventType) => {
  const response = await api.post("/api/community/event", data);
  return response.data;
};

type CreateEventMutationOption = {
  mutationConfig?: MutationConfig<typeof createEvent>;
};

export const useCreateEvent = ({
  mutationConfig,
}: CreateEventMutationOption) => {
  const { ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createEvent,
  });
};
