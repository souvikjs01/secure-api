import { prisma } from "@/lib/prisma";
import ratelimit from "@/lib/ratelimit";
import { BlogSchema } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) : Promise<NextResponse> {
    try {
        // 3. rate limiting on the blog post:
        const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1'
        const { success } = await ratelimit.limit(ip)
        if(!success) {
            return NextResponse.json({
                message: "Get the hell out of here Spammer!"
            }, {
                status: 429
            })
        }

        // 2. check server side authentication:
        const { userId } = await auth()
        if(!userId) {
            return NextResponse.json({
                message: "Unauthorized"
            }, {
                status: 401
            })
        }

        const body = await req.json();

        // 1. server side validation:
        const validateData = BlogSchema.safeParse(body)
        if(!validateData.success) {
            return NextResponse.json({
                message: "Invalid data",
            },{
                status: 400
            })
        }

        const blog = await prisma.blog.create({
            data: {
                title: validateData.data.title,
                authorName: validateData.data.authorName,
                content: validateData.data.content
            }
        })
        if(!blog) {
            return NextResponse.json({
                message: "Failed creating the blog",
            }, {
                status: 500
            })
        }

        // 4. data safety
        const safeData = {
            id: blog.id,
            title: blog.title,
            content: blog.content,
        }

        return NextResponse.json({
            data: safeData,
            message: "Article created successfully",
        }, {
            status: 200
        })
    } catch (error) {
        // 5. proper error handling:
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({message: 'Database error'}, { status: 500 });
        }
        
        return NextResponse.json({
            message: 'Internal server error'
        }, {
            status: 500
        })
    }
}