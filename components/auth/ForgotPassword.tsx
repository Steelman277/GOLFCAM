import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface Props {
  setDisplay: (page: string) => void
}



const ForgotPassword = ({setDisplay}: Props) => {
    const [email, setEmail] = useState('');

    async function handleSendLink() {
    console.log('Sending link to ' + email);

    setDisplay('signin');
    }


  return (

      <Card> 
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="John.Doe@email.com"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          {/* w-full makes the button span the full width of the card */}
          <Button variant="outline" className="w-full" onClick={() => handleSendLink()}>
            Send Reset Link
          </Button>
        </CardFooter>
      </Card>

  )
}

export default ForgotPassword