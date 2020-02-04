import mongoose from 'mongoose'

export default mongoose.model(
	'profile',
	new mongoose.Schema({
		user: { type: mongoose.Schema.types.objectId, ref: 'user' },
		company: {
			type: String,
		},
		website: {
			type: String,
		},
		location: {
			type: String,
		},
		status: {
			type: String,
			required: true,
		},
		skills: {
			type: [String],
			required: true,
		},
		bio: {
			type: String,
		},
		githubUserName: {
			type: String,
			required: true,
		},
		experiences: [
			{ title: { type: String, required: true } },
			{ company: { type: String, required: true } },
			{ location: { type: String } },
			{ from: { type: String, required: true } },
			{ to: { type: String } },
			{ current: { type: String, default: false } },
			{ description: { type: String } },
		],
		edication: [
			{ school: { type: String, required: true } },
			{ degree: { type: String, required: true } },
			{ fieldOfStudy: { type: String, required: true } },
			{ from: { type: String, required: true } },
			{ to: { type: String } },
			{ current: { type: String, default: false } },
			{ description: { type: String } },
		],
		social: {
			youtube: { type: String },
			instagram: { type: String },
			twitter: { type: String },
			facebook: { type: String },
			linkedin: { type: String },
		},
		date: {
			type: Date,
			default: Date.now,
		},
	}),
)
