import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

export default async () => {
    mongoose.connect(process.env.MONGOCONN)    
}
