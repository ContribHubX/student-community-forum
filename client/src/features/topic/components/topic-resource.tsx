import { useState } from "react";
import { useGetTopics, useCreateTopic, createTopicSchema } from "../api";
import { TopicLibraryCard } from "./topic-library-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";

export const TopicResource = () => {
  const { authState } = useAuth();
  const { data: topics } = useGetTopics({});
  const { mutate: createTopic } = useCreateTopic({});

  const [searchTerm, setSearchTerm] = useState("");
  const [showUserTopics, setShowUserTopics] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof createTopicSchema>>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createTopicSchema>) => {
    if (!authState || !authState.user) return;

    try {
      createTopic({
        name: values.name,
        attachment: values.attachment,
        createdBy: authState.user.id.toString(),
      });
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create topic:", error);
    }

    console.log(values);
  };

  const filteredTopics = topics?.filter((topic) => {
    const matchesSearch = topic.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesUserTopics = showUserTopics
      ? topic?.createdBy?.id.toString() === authState?.user?.id.toString()
      : true;
    return matchesSearch && matchesUserTopics;
  });

  console.log(topics);

  return (
    <div className="container mx-auto px-4 py-8 text-primary-foreground">
      <h1 className="text-4xl font-bold mb-8 text-center">Explore Topics</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        {/* <Select onValueChange={setFilter} defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="arts">Arts</SelectItem>
          </SelectContent>
        </Select> */}
        <div className="flex items-center space-x-2 ">
          <Switch
            id="user-topics"
            checked={showUserTopics}
            onCheckedChange={setShowUserTopics}
          />
          <Label htmlFor="user-topics">My Topics</Label>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="text-sm text-accent-foreground">
              Create Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Topic</DialogTitle>
              <DialogDescription>
                Add a new topic to the library. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter topic name" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the name of your new topic.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attachment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attachment</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        Optionally attach a file to your topic.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Save Topic</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {filteredTopics?.map((topic) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TopicLibraryCard topic={topic} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredTopics?.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No topics found. Try adjusting your search or filter.
        </p>
      )}

      <div className="mt-12 text-center">
        <Button className="text-accent-foreground">Load More Topics</Button>
      </div>
    </div>
  );
};
