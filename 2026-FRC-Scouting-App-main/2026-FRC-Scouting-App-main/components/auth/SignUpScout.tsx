'use client';


import { useState } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { IUser } from "@/models/auth/User"
import storeUser from "@/lib/auth/storeUser"

interface Props {
  setDisplay: (page: string) => void
}


const emptyData = {
  number: '',
  name: '',
  email: '',
  password: '',
  phone: '',
  role: 'Scout',
  isManager: false,
  isApproved: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}


 
const SignUpScout = ({setDisplay}: Props) => {
  const [data, setData] = useState<IUser>(emptyData);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
 
  const handleStoreUser = async () => {
    
    
    // Validate all fields are filled
    if (!data.number) {
      setError("Please enter your Team Number");
      return;
    }
    if (!data.email) {
      setError("Please enter your Manager Email");
      return;
    }

    if (!data.password) {
      setError("Please enter a Password");
      return;
    }
    if (!termsAccepted) {
      setError("You must accept the terms and conditions");
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await storeUser(data);
      if (response.result) {
        setSuccess('Account created successfully! You can now sign in.');
        setData(emptyData);
        setTermsAccepted(false);
        setDisplay('signin');
      } else {
        setError(response.message || 'Failed to create account');
      }

    } catch (err) {
      setError('An error occurred while creating your account. Please try again.');
    }

  }


  return (
    
      <Card>
        <CardHeader>
          <CardTitle>Sign Up for an Account</CardTitle>
          <CardDescription>Create your account by filling the form below.</CardDescription>

        </CardHeader>
        <CardContent>
          
            <div className="flex flex-col gap-3">
              {error && (
                <div className="rounded bg-red-100 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded bg-green-100 p-3 text-sm text-green-700">
                  {success}
                </div>
              )}
              <div className="grid gap-3">
                <Label htmlFor="number">Team Number</Label>
                <Input 
                  id="number" 
                  type="text" 
                  required 
                  placeholder="12345"
                  value={data.number}
                  onChange={(e) => {setData({...data, number: e.target.value})}}
                />
              </div>
             
              <div className="grid gap-3">
                <Label htmlFor="email">student Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email@Email.com"
                  required
                  value={data.email}
                  onChange={(e) => {setData({...data, email: e.target.value})}}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">student Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required
                  value={data.password}
                  onChange={(e) => {setData({...data, password: e.target.value})}}
                />
              <div className="grid gap-3">
              </div>
              <div className="flex items-start gap-2">
                <Checkbox 
                  className="h-6 w-6 text-green-500 mt-1" 
                  required
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm">I am responsible for my and my teams actions. By using this app, your team will not add bad data into the database and will input data that is meaningful to the database</label>
              </div>
              <div>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  onClick={() => {handleStoreUser()}}
                >
                    
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

  );
}

export default SignUpScout;