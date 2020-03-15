import express from 'express'
import cors from 'cors'
import connectDB from './config/db'

const whitelist = ['http://localhost:3000']
const corsOptions = {
	origin: function(origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
}

const app = express()
app.use(cors(corsOptions))

//Connect database
connectDB()

//Init Middleware
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('API running'))

// Define Routes

import users from './routes/api/users'
import auth from './routes/api/auth'
import posts from './routes/api/posts'
import profile from './routes/api/profile'

app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/posts', posts)
app.use('/api/profile', profile)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`Server started on ${PORT}`)
})
