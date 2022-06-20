import nc from 'next-connect'
import Order from '../../../models/Order'
import Product from '../../../models/Product'
import User from '../../../models/User'
import { isAuth } from '../../../utils/auth'
import db from '../../../utils/db'
import { onError } from '../../../utils/error'

const handler = nc({
    onError
})

handler.use(isAuth)

handler.get(async (req, res) => {
    await db.connect()

    const ordersCount = await Order.countDocuments()
    const productsCount = await Product.countDocuments()
    const usersCount = await User.countDocuments()

    const orderPriceGroup = await Order.aggregate([
        {
            $group: {
                _id: null,
                sales: {
                    $sum: '$totalPrice'
                }
            }
        }
    ])

    const ordersPrice = orderPriceGroup.length > 0 ? orderPriceGroup[0].sales : 0

    const salesData = await Order.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                totalSales: { $sum: '$totalPrice' }
            }
        }
    ])

    res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData })
})

export default handler