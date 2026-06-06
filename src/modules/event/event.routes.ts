import { Router } from 'express'
import { EventController } from './event.controller'

export const eventRoutes = Router()

const controller = new EventController()

eventRoutes.get('/active', controller.getActiveEvents)
