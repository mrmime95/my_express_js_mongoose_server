import mongoose from 'mongoose'

export default mongoose.model(
	'user',
	new mongoose.Schema({
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatar: {
			type: String,
		},
		date: {
			type: Date,
			default: Date.now,
		},
	}),
)
