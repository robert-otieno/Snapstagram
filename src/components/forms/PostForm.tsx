import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Textarea } from "../ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { PostValidation } from "@/lib/validation";
import { Input } from "../ui/input";
import FileUploader from "../shared/FileUploader";
import { Button } from "../ui/button";
import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "../ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/lib/react-query/queriesAndMutations";

// import { Models } from "appwrite";
// import { useNavigate } from "react-router-dom";

// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Button, Input, Textarea } from "@/components/ui";
// import { PostValidation } from "@/lib/validation";
// import { useToast } from "@/components/ui/use-toast";
// import { useUserContext } from "@/context/AuthContext";
// import { FileUploader, Loader } from "@/components/shared";
// import { useCreatePost, useUpdatePost } from "@/lib/react-query/queries";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();

  // 1. Define your form
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });

  // Query
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
  //   const { mutateAsync: updatePost, isLoading: isLoadingUpdate } = useUpdatePost();

  // 2. Define a submit handler
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    console.log(values);
    //     // ACTION = UPDATE
    //     if (post && action === "Update") {
    //       const updatedPost = await updatePost({
    //         ...value,
    //         postId: post.$id,
    //         imageId: post.imageId,
    //         imageUrl: post.imageUrl,
    //       });

    //       if (!updatedPost) {
    //         toast({
    //           title: `${action} post failed. Please try again.`,
    //         });
    //       }
    //       return navigate(`/posts/${post.$id}`);
    //     }

    // ACTION = CREATE
    const newPost = await createPost({
      ...values,
      userId: user.id,
    });

    if (!newPost) {
      toast({
        title: "Please try again.",
        // title: `${action} post failed. Please try again.`,
      });
    }
    navigate("/");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea className="shad-textarea custom-scrollbar" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags (separated by comma " , ")</FormLabel>
              <FormControl>
                <Input placeholder="Art, Expression, Learn" type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          {/* <Button type="button" className="shad-button_dark_4" onClick={() => navigate(-1)}> */}
          <Button type="button" className="shad-button_dark_4">
            Cancel
          </Button>
          <Button type="submit" className="shad-button_primary whitespace-nowrap">
            {/* <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isLoadingCreate || isLoadingUpdate}> */}
            {/* {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post */}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
