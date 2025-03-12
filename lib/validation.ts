import { z } from "zod"

export const BlogSchema = z.object({
    title: z.string().min(3, {
        message: "Title should be atleast 3 char long",
    }).max(50, {
        message: "Title should be at most 100 characters long"
    }),
    authorName: z.string().min(2, {
        message: "Author name should be at least 2 characters long",
    }).max(50, {
        message: "Author name should be at most 50 characters long",
    }),
    content: z.string().min(10, {
        message: "Content should be at least 10 characters long",
    })
})

export type Blog = z.infer<typeof BlogSchema>