'use client';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

type Props = {
    signUpTab: React.ReactNode,
    signInTab: React.ReactNode
}

export function TabSwitcher({ signInTab, signUpTab }: Props) {
    return (
        <Tabs className="max-w-[600px]" defaultValue="sign-in">
            <TabsList className="grid w-full grid-cols-2">                
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in">
                {signInTab}
            </TabsContent>
            <TabsContent value="sign-up">
                {signUpTab}
            </TabsContent>            
        </Tabs>
    )
}