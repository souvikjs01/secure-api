"use client"
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Blog, BlogSchema } from "@/lib/validation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea";
import axios from "axios"
import { toast } from "sonner";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false)
  const form = useForm<Blog>({
    resolver: zodResolver(BlogSchema),
    defaultValues: {
      title: "",
      authorName: "",
      content: "",
    },
  })

  const onSubmit: SubmitHandler<Blog> = async (data: Blog) => {
    setLoading(true)
    try {
      const resp = await axios.post("/api/submission", data);
      if (!resp.data?.message) {
        toast.error("Unexpected response from server");
      } else {
        toast.success(resp.data.message);
      }
    } catch (error: any) {
      if (error.response?.status === 429) {
        toast.error("You're posting too quickly. Please slow down.");
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "Invalid data");
      } else {
        toast.error("Unauthorized. Please log in first");
      }
    } finally {
      setLoading(false);
      form.reset()
    }
  }
  return (
    <div className="mt-10 flex justify-center items-center max-w-lg mx-auto">
      <Card className=" w-full shadow-neutral-200 rounded-sm">
        <CardHeader>
          <CardTitle className=" text-2xl font-bold">Create a new blog Article</CardTitle>
          <CardDescription >What would you like to write about</CardDescription>
        </CardHeader>
        <CardContent className=" h-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-lg font-medium">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="authorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium">Author Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name of the Author" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-lg font-medium">Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="blog content" 
                        {...field} 
                        className=" h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
