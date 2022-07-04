const router = require('express').Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/', async (req, res) => {
  try {
    const UserId = req.user.id
    let todos = await Todo.findAll({ where: { UserId } })
    todos = todos.map(todo => todo.dataValues)
    return res.render('index', { todos: todos })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
