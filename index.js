import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import {
	CommentController,
	PostController,
	UserController,
} from './controllers/index.js'

import { getPostsByTag } from './controllers/PostController.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'
import {
	loginValidation,
	postCreateValidation,
	registerValidation,
	commentCreateValidation
} from './validation.js'

mongoose
	.connect(
		'mongodb+srv://platonivankiv:qwer1234@platon.txa9qmi.mongodb.net/blog'
	)
	.then(() => console.log('DB ok'))
	.catch(err => console.log('DB error', err))

const app = express()

const storage = multer.diskStorage({
	destination: (_, __, callback) => {
		callback(null, 'uploads')
	},
	filename: (_, file, callback) => {
		callback(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post(
	'/auth/register',
	registerValidation,
	handleValidationErrors,
	UserController.register
)

app.post(
	'/auth/login',
	loginValidation,
	handleValidationErrors,
	UserController.login
)

app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

app.get('/tags', PostController.getLastTags)
app.get('/posts/tags/:tagName', getPostsByTag)
app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.get('/posts/:id/comments', CommentController.getAll)
app.post('/posts/:id/comments', checkAuth, handleValidationErrors,  CommentController.create)
app.delete('/comments/:id', checkAuth, CommentController.remove)
app.patch('/comments/:id', checkAuth, handleValidationErrors, commentCreateValidation, CommentController.update)

app.post(
	'/posts',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.create
)

app.delete('/posts/:id', checkAuth, PostController.remove)

app.patch(
	'/posts/:id',
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update
)

app.listen(4444, err => {
	if (err) {
		return console.log(err)
	}

	console.log('Server ok')
})
