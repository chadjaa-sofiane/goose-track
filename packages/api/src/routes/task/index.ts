import { Router } from 'express'
import passport from 'passport'
import validate from '@/middlewares/validate'
import { createTask, createTaskSchema } from './controllers/createTask'
import { updateTask, updateTaskSchema } from './controllers/updateTask'
import { deleteTask, deleteTaskSchema } from './controllers/deleteTask'

const taskRouter = Router()

taskRouter.post(
    '/',
    validate(createTaskSchema),
    passport.authenticate('jwt', { session: false }),
    createTask
)

taskRouter.patch(
    '/:id',
    validate(updateTaskSchema),
    passport.authenticate('jwt', { session: false }),
    updateTask
)

taskRouter.delete(
    '/:id',
    validate(deleteTaskSchema),
    passport.authenticate('jwt', { session: false }),
    deleteTask
)

export default taskRouter
