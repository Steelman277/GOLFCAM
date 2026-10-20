'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SignIn = () => {
    
    
    return (
        <Card >
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    Sign in to your account to scout!
                </CardDescription>
                <div className="flex flex-col gap-2 p-2">
                    <Label className="text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bol text-left">Email</Label>
                    <Input className="w-full" placeholder="Email" />
                    <Label className="text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-left">Password</Label>
                    <Input className="w-full" placeholder="Password"  />
                    <Button className="w-full">Sign In</Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default SignIn