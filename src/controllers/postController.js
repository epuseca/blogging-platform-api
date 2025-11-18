const Post = require('../models/post')

const createPost = async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;
        if (!title || !content || !category) {
            return res.status(400).json({
                message: 'Title, content, category are required!',
                success: false
            })
        }
        const post = new Post({
            title, content, category, tags: tags || []
        })
        await post.save()
        res.status(201).json({
            success: true,
            message: 'Created a new post',
            data: post
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category, tags } = req.body;

        const existingPost = await Post.findById(id);
        if (!existingPost) {
            return res.status(400).json({
                success: false,
                message: "Not found post!"
            })
        }
        if (!title || !content || !category) {
            return res.status(400).json({
                message: 'Title, content, category are required!',
                success: false
            })
        }
        const dataUpdate = {
            title, content, category, tags: tags || []
        }
        const post = await Post.findByIdAndUpdate(
            id,
            dataUpdate,
            { new: true, runValidators: true }
        )
        res.status(200).json({
            success: true,
            data: post,
            message: "Updated post successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const existingPost = await Post.findById(id);
        if (!existingPost) {
            return res.status(400).json({
                success: false,
                message: "Not found Post!"
            })
        }
        const post = await Post.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Deleted post successfully",
            data: post
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(400).json({
                success: false,
                message: "Not found Post!"
            })
        }
        res.status(200).json({
            success: true,
            message: "Get post successfully",
            data: post
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllPost = async (req, res) => {
    try {
        const { limit = 10, page = 1, search, sort = '-createdAt', filter } = req.query;
        const query = {}
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ]
        }
        const limitNum = parseInt(limit);
        const total = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .limit(limitNum)
            .skip((page - 1) * limit)
            .sort(sort);

        if (!posts) {
            return res.status(400).json({
                success: false,
                message: "Not found Post!"
            })
        }
        res.status(200).json({
            success: true,
            message: "Get all post successfully",
            data: {
                posts,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    limit: limitNum,
                    total: total
                }
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    createPost, updatePost, deletePost, getPostById, getAllPost
}