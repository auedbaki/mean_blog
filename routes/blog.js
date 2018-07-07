var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const BlogController = require('../Controllers/Blog');

router.post('/newBlog',checkAuth,BlogController.post_new_blog);

router.get('/articles', BlogController.get_recent_articles);

router.get('/id/:id', BlogController.get_article_by_id);

router.get('/author/:username',BlogController.get_article_by_author);

router.put('/edit/:id',checkAuth,BlogController.edit_article);

router.delete('/delete/:id',checkAuth,BlogController.delete_article);

router.put('/like/:id',checkAuth, BlogController.like_article);

router.put('/dislike/:id',checkAuth, BlogController.dislike_article);

module.exports = router;
