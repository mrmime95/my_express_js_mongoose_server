const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')

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

			res.send('User registered')
		} catch (err) {
			console.error(err)
			return res.status(500).send('Server error')
		}
	},
)

module.exports = router
