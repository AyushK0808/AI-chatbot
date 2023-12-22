"use client"
import qs from "query-string"
import { Search } from "lucide-react";
import { Input } from "./ui/input";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { ChangeEventHandler, useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () => {

    const router=useRouter()
    const params=useSearchParams()

    const catID= params.get("catID")
    const name=params.get("name")

    const [value,setValue]= useState(name || "");
    const debouncedValue= useDebounce<string>(value,500)

    const onChange: ChangeEventHandler<HTMLInputElement>=(e) =>{
        setValue(e.target.value)
    }

    useEffect(()=>{
        const query={
            name:debouncedValue,
            catID: catID,
        };

        const url=qs.stringifyUrl({
          url:window.location.href,
          query  
    },{skipNull:true, skipEmptyString:true})

    router.push(url)
    },[debouncedValue,router,catID]
    )

    return ( <div className="relative">
        <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground"/>
        <Input
        onChange={onChange}
        value={value}
        placeholder="Search..."
        className="pl-10 bg-primary/10"
        />
    </div>  );
}
 
