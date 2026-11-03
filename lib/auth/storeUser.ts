'use server'

import connectDB from "@/lib/db"
import { IUser } from "@/models/auth/User"
import User from "@/models/auth/User"
import { genSalt, hashSync } from "bcrypt-ts"

export default async function storeUser(user: IUser) {

    const salt = await genSalt(10);
    user.password = hashSync(user.password, salt);

    await connectDB()
  try {
    const store = await User.findOneAndUpdate({ email: user.email }, user, { upsert: true, new: true })
    return ({result: true, message: "User Stored Successfully"})
  } catch (error) {
    //console.log(error)
    return ({result: false, message: "Error Occured, Could Not Store User"})
  }
}