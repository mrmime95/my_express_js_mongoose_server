import express from 'express'
import auth from '../../middleware/auth'
import Profile from '../../models/Profile'
import { check, validationResult } from 'express-validator'

const router = express.Router()

// @route     GET api/profile/me
// @desc      Get the current user profile
// @access    Private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])
		if (!profile) {
			return res.status(404).json({ msg: 'No profile for user' })
		}
		res.json(profile)
	} catch (error) {
		console.error(error)
		return res.status(500).send('Server error')
	}
})

// @route     POST api/profile
// @desc      Create or update a user profile
// @access    Private
router.post(
	'/',
	[
		auth,
		[
			check('status', 'Status is requred')
				.not()
				.isEmpty(),
			check('skills', 'Skills array is required')
				.not()
				.isEmpty(),
		],
	],
	async (req, res) => {
		// data validation
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		try {
			let profile = await Profile.findOne({ user: req.user.id })
			const dataProdile = { user: req.user.id, ...req.body }

			if (!profile) {
				//Create
				profile = new Profile(dataProdile)
				await profile.save()
				console.log('Profile created')
			} else {
				//Update
				await Profile.findOneAndUpdate({ user: req.user.id }, { $set: dataProdile }, { new: true })
				console.log('Profile updated')
			}

			res.json({ dataProdile })
		} catch (err) {
			console.error(err)
			res.status(500).send('Server Error')
		}
	},
)

// @route     GET api/profile
// @desc      Get all profiles
// @access    Public
router.get('/', async (req, res) => {
	try {
		const profile = await Profile.find().populate('user', ['name', 'avatar'])
		res.json(profile)
	} catch (error) {
		console.error(error)
		return res.status(500).send('Server error')
	}
})

// @route     GET api/profile/user/:user_id
// @desc      Get profile by userID
// @access    Public
router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' })
		}
		res.json(profile)
	} catch (error) {
		console.error(error.message)
		if (error.kind === 'ObjectId') {
			return res.status(400).json({ msg: 'There is no profile for this user' })
		}

		return res.status(500).send('Server error')
	}
})

export default router
