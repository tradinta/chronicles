
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";

const tipSchema = z.object({
  title: z.string().min(1, "Title is required."),
  details: z.string().min(10, "Please provide more details."),
  category: z.string({
    required_error: "Please select a category.",
  }),
});

export default function SubmitTipForm() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof tipSchema>>({
    resolver: zodResolver(tipSchema),
    defaultValues: {
      title: "",
      details: "",
    },
  });

  function onSubmit(values: z.infer<typeof tipSchema>) {
    console.log(values);
    toast({
      title: "Tip Submitted!",
      description: "Thank you for your contribution. Our team will review it shortly.",
    });
    // Here you would handle form submission, e.g., send to an API endpoint
  }

  return (
    <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-stone-700 text-stone-200">
      <DialogHeader>
        <DialogTitle className="font-serif text-2xl text-stone-100">Submit a Tip Anonymously</DialogTitle>
        <DialogDescription className="text-stone-400">
            Your identity will be kept confidential. Please do not include personal information.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-stone-300">Title / Subject</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Secret Tech Merger" 
                    {...field} 
                    className="bg-zinc-800 border-stone-600 text-stone-200 focus:ring-purple-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-stone-300">Tip Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide all the details here..." 
                    {...field} 
                    className="bg-zinc-800 border-stone-600 text-stone-200 focus:ring-purple-500"
                    rows={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-stone-300">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-zinc-800 border-stone-600 text-stone-200 focus:ring-purple-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-800 border-stone-600 text-stone-200">
                  <SelectItem value="celebrity">Celebrity</SelectItem>
                  <SelectItem value="influencer">Influencer</SelectItem>
                  <SelectItem value="controversy">Controversy</SelectItem>
                  <SelectItem value="nsfw">NSFW</SelectItem>
                  <SelectItem value="politics">Politics</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
          
          <DialogFooter>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
              Send Tip
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
