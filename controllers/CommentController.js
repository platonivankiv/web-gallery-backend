import CommentModel from '../models/Comment.js'

export const getAll = async (req, res) => {
	try {
		const comments = await CommentModel.find().populate('post').exec()
		res.json(comments)
	} catch (err) {
		res.status(500).json({
			message: 'Не удалось получить комментарии',
		})
	}
}

export const create = async (req, res) => {
	try {
		const doc = new CommentModel({
			text: req.body.text,
			user: req.userId,
			post: req.params.id,
		})
		const comment = await doc.save()
		await comment.populate('user', 'userName')
		await comment.populate('post', 'title')
		res.json(comment)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось создать пост',
		})
	}
}

export const remove = async (req, res) => {
	try {
		const commentId = req.params.id
		const deletedComment = await CommentModel.findOneAndDelete({
			_id: commentId,
		})

		if (!deletedComment) {
			return res.status(404).json({
				message: 'Комментарий не найден',
			})
		}
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось удалить комментарий',
		})
	}
}

export const update = async (req, res) => {
	try {
		const commentId = req.params.id
		const updateComment = await CommentModel.findByIdAndUpdate(
			commentId,
			{ text: req.body.text },
			{ new: true }
		)

		if (!updateComment) {
			return res.status(404).json({
				message: 'Комментарий не найден',
			})
		}
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось обновить комментарий',
		})
	}
}
