import express from "express"
import usersRouter from "./users"
import productsRouter from "./products"
import categoriesRouter from "./categories"
import loginRouter from "./login"
import analyticsRouter from "./analytics"

const router = express.Router()

// Register all routes
router.use("/users", usersRouter)
router.use("/products", productsRouter)
router.use("/categories", categoriesRouter)
router.use("/login", loginRouter)
router.use("/analytics", analyticsRouter)

export default router
