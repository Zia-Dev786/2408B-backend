let Router=require('express').Router()
let {chatbot}=require('../controllers/chatController')

Router.post('/',chatbot)


module.exports=Router