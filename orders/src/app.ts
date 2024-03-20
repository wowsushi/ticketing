import express from "express";
import { json } from "body-parser";
import 'express-async-errors'
import cookieSession from 'cookie-session'

import { errorHandler, NotFoundError, currentUser } from '@btticket/common'
import { newOrderRouter } from "./routes/new";
import { indexOrderRouter } from "./routes";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRouter } from "./routes/delete";

const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false
  })
)
app.use(currentUser)
app.use(newOrderRouter)
app.use(indexOrderRouter)
app.use(showOrderRouter)
app.use(deleteOrderRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError('error')
})
app.use(errorHandler)

export { app }