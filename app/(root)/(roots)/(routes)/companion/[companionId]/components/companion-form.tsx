"use client";

import * as z from "zod";
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import axios from "axios"
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const INSTR="You're Virat Kohli, a cricket icon renowned for unmatched dedication and agility. With accolades from top cricket teams, your commitment to fitness sets you apart. Off-field, charm, sharp style, and philanthropy define you. Every innings reflects your profound passion, fueled by fan support. You're driven to be the best, leaving an indelible mark."

const SEED="Human: Hi Virat, how's your day shaping up? \nVirat: Intense training, but that's the way to get better. How about yours?\nHuman: Not as thrilling as your world, I suppose!\nVirat: Everyone's got their own field and goals. Find yours and give it everything you've got!"
interface CompanionFormProps{
    initialData: Companion | null;
    categories: Category[];
}

const formSchema= z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    description: z.string().min(1, {
        message: "Description is required",
    }),
    instruction: z.string().min(200, {
        message: "Instructions must be atleast 200 characters",
    }),
    seed: z.string().min(200, {
        message: "Seed must be atleast 200 characters",
    }),
    src: z.string().min(1, {
        message: "Image is required",
    }),
    categoryId: z.string().min(1, {
        message: "Category is required",
    }),
})
export const CompanionForm = ({
    categories,initialData
}:CompanionFormProps) => {

    const {toast}= useToast()
    const router= useRouter()

    const form= useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData|| {
            name: "",
            description: "",
            instruction: "",
            seed: "",
            src: "",
            categoryId: undefined,
        }
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try{
            if (initialData){
                await axios.patch('/api/companion/${initialData.id}',values)

            }else{
                await axios.post('/api/companion',values)
            }
            toast({
                variant: "destructive",
                description: "WOOHOO! The process was successful!!"
            })

            router.refresh()
            router.push("/")
        }catch(error){
            toast({
                variant: "destructive",
                description: "OOPS! Something went wrong"
            })
        }
    }
    return ( <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pb-10">
                <div className="space-y-2 w-full">
                    <div>
                    <h3 className="text-lg font-medium">General Information</h3>
                    <p className="text-sm text-muted-foreground">General Information about your ChatBot</p>
                    </div>
                    <Separator className="bg-primary/10"/>
                </div>
                <FormField
                name='src'
                render={({field}) => (
                    <FormItem className="flex flex-col items-center justify-center space-y-4">
                    <FormControl>
                    <ImageUpload 
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                    />
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                    )}/>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                        name="name"
                        control={form.control}
                        render={({field})=> (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
                                    placeholder="Virat Kohli"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is what your AI bot shall be called
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        name="description"
                        control={form.control}
                        render={({field})=> (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input
                                    disabled={isLoading}
                                    placeholder="Indian Cricketer"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is how your AI bot will be described
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="categoryId"
                        control={form.control}
                        render={({field})=> (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select 
                                disabled={isLoading}
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue
                                            defaultValue={field.value}
                                            placeholder="Select a Category"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category)=>(
                                            <SelectItem 
                                            key={category.id}
                                            value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select a category for your ChatBot
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    </div>
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">Configuration</h3>
                            <p>Detailed Instructions for ChatBot Behaviour</p>
                        </div>
                        <Separator className="bg-primary/10"/>
                    </div>
                    <FormField
                        name="instruction"
                        control={form.control}
                        render={({field})=> (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Instructions</FormLabel>
                                <FormControl>
                                    <Textarea
                                    className="bg-background resize-none"
                                    rows={7}
                                    disabled={isLoading}
                                    placeholder={INSTR}
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Describe your Bot providing things like backstory and other details regarding personality
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="seed"
                        control={form.control}
                        render={({field})=> (
                            <FormItem className="col-span-2 md:col-span-1">
                                <FormLabel>Example Conversation with Bot</FormLabel>
                                <FormControl>
                                    <Textarea
                                    className="bg-background resize-none"
                                    rows={7}
                                    disabled={isLoading}
                                    placeholder={SEED}
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Give a sample conversation with your Bot
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="w-full flex justify-center">
                        <Button size="lg" disabled={isLoading}>
                            {initialData ? "Edit your Bot" : "Create new bot"}
                            <Wand2 className="w-4 h-4 ml-2"/>
                        </Button>
                    </div>
            </form>

        </Form>
        </div> );
}
 
