import PostModel from '../models/Post.js'

export const getAll = async (req, res) => {
	const sortType = req.query.sort
	let sortOrder

	switch (sortType) {
		case 'new':
			sortOrder = { createdAt: -1 }
			break
		case 'popular':
			sortOrder = { viewsCount: -1 }
			break
	}
	try {
		const posts = await PostModel.find().sort(sortOrder).populate('user').exec()
		res.json(posts)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить посты',
		})
	}
}

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id

		PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				returnDocument: 'after',
			}
		).then(post => {
			if (!post) {
				return res.status(404).json({
					message: 'Пост не найден',
				})
			}
			res.json(post)
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить посты',
		})
	}
}
export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			tags: req.body.tags.split(','),
			imageUrl: req.body.imageUrl,
			user: req.userId,
		})

		const post = await doc.save()

		res.json(post)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось создать пост',
		})
	}
}
export const remove = async (req, res) => {
	try {
		const postId = req.params.id

		PostModel.findOneAndDelete({
			_id: postId,
		}).then(post => {
			if (!post) {
				return res.status(404).json({
					message: 'Пост не найден',
				})
			}
			res.json({
				success: true,
			})
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось удалить пост',
		})
	}
}
export const update = async (req, res) => {
	try {
		const postId = req.params.id

		await PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				tags: req.body.tags.split(',').map(tag => tag.trim()),
				imageUrl: req.body.imageUrl,
				user: req.userId,
			}
		)
		res.json({
			success: true,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось обновить пост',
		})
	}
}

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec()

		const tags = posts
			.map(obj => obj.tags)
			.flat()
			.slice(0, 5)

		res.json(tags)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить теги',
		})
	}
}

export const getPostsByTag = async (req, res) => {
	try {
		const tagName = req.params.tagName
		const posts = await PostModel.find({ tags: tagName })
			.populate('user')
			.exec()
		res.json(posts)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить посты с указанным тегом',
		})
	}
}
