import express from 'express'
import auth from '../../middleware/auth'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'
import { check, validationResult } from 'express-validator'

import User from '../../models/User'

const router = express.Router()

// @route     GET api/auth
// @desc      Get Authenticated user
// @access    Protected
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password')
		res.json(user)
	} catch (err) {
		console.log(err.message)
		res.status(500).send('Server Error')
	}
})

// @route     POST api/auth
// @desc      Authenticate user and get token
// @access    Public
router.post(
	'/',
	[check('email', 'Please include a valid email').isEmail(), check('password', 'Password is required').exists()],
	async (req, res) => {
		// data validation
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { email, password } = req.body
		try {
			// see if the user exists
			let user = await User.findOne({ email })
			if (!user) {
				return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })
			}

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })
			}

			// return jsonwebtoken
			const payload = {
				user: {
					id: user.id,
				},
			}

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: 360000, //TODO:change to 3600
				},
				(err, token) => {
					if (err) {
						throw err
					}
					res.json({ token })
				},
			)
		} catch (err) {
			console.error(err.message)
			return res.status(500).send('Server error')
		}
	},
)

export default router
