import jwt from 'jsonwebtoken'
import config from 'config'

export default function(req, res, next) {
	// get the token from the header
	const token = req.header('x-auth-token')

	// check if no token
	if (!token) {
		return res.status(401).json({ msg: 'No token, authorization denied' })
	}

	//Verify token
	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'))
		req.user = decoded.user
		next()
	} catch (err) {
		console.error(err)
		res.status(401).json({ msg: 'Token is not valid' })
	}
}
