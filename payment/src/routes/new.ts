import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus
} from '@btticket/common'
import { Order } from '../models/order'
import { Payment } from '../models/payment'
import { stripe } from '../stripe'
import { natsWrapper } from '../nats-wrapper'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
const router = express.Router()

router.post('/api/payment',
    requireAuth,
    [
        body('token')
            .not()
            .isEmpty(),
        body('orderId')
            .not()
            .isEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body

        const order = await Order.findById(orderId)

        if (!order) {
            throw new NotFoundError('not found')
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError()
        }

        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('cannot pay for an cancelled order')
        }

        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token
        })

        const payment = Payment.build({
            orderId: orderId,
            stripeId: charge.id
        })

        await payment.save()

        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        })
        res.status(201).send({ id: payment.id })
    }
)

export { router as createChargeRouter }
