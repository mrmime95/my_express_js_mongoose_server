import mongoose from 'mongoose'
import config from 'config'

const db = config.get('mongoURI')

export default async function connectDB() {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		})
		console.log('MongoDB connected...')
	} catch (error) {
		console.error(error)
		//Exit process with failure
		process.exit(1)
	}
}
