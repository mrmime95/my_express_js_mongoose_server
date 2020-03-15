import express from 'express'
import gravatar from 'gravatar'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'
import { check, validationResult } from 'express-validator'

import User from '../../models/User'

const router = express.Router()

// @route     POST api/users
// @desc      Register route
// @access    Public
router.post(
	'/',
	[
		check('name', 'Name is requred')
			.not()
			.isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
	],
	async (req, res) => {
		console.log(req.body)
		// data validation
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { name, email, password } = req.body
		try {
			// see if the user exists
			let user = await User.findOne({ email })
			if (user) {
				return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
			}

			// get users gravatar
			const avatar = gravatar.url(email, { s: 200, d: 'mm' })

			//create user model
			user = new User({ name, email, avatar, password })

			// encrypt password with bcrypt
			const salt = await bcrypt.genSalt(10)
			user.password = await bcrypt.hash(password, salt)

			// save user to database
			await user.save()

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
			console.error(err)
			return res.status(500).send('Server error')
		}
	},
)

export default router
