const router = require('express').Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/new', (req, res) => res.render('new'))

router.post('/', async (req, res) => {
  try {
    const name = req.body.name
    const UserId = req.user.id
    await Todo.create({ name, isDone: false, UserId })
    return res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const UserId = req.user.id
    const todo = await Todo.findOne({ where: { id, UserId } })
    return res.render('detail', { todo: todo.dataValues })
  } catch (err) {
    console.log(err)
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const id = req.params.id
    const UserId = req.user.id
    const todo = await Todo.findOne({ where: { id, UserId } })
    return res.render('edit', { todo: todo.dataValues })
  } catch (err) {
    console.log(err)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const UserId = req.user.id
    const { name, isDone } = req.body
    const todo = Todo.findOne({ where: { id, UserId } })
    todo.name = name
    todo.isDone = isDone === 'on'
    await Todo.update({ name, isDone: isDone === 'on' }, { where: { id } })
    return res.redirect(`/todos/${id}`)
  } catch (err) {
    console.log(err)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const UserId = req.user.id
    const todo = await Todo.findOne({ where: { id, UserId } })
    await todo.destroy()
    return res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
