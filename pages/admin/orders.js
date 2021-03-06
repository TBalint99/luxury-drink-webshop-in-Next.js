import { Button, Card, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import NextLink from 'next/link'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useReducer } from 'react'
import Layout from '../../components/Layout'
import { getError } from '../../utils/error'
import useStyles from '../../utils/styles'
import { Store } from '../../utils/Store'
import { Skeleton } from '@material-ui/lab'

const initialState = {
    loading: true,
    orders: [],
    error: ''
}

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true, error: ''}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, orders: action.payload,  error: ''}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload,}
        default:
            return state;
    }
}

function AdminOrders() {
    const { state } = useContext(Store)
    const { userInfo } = state
    const router = useRouter()
    const classes = useStyles()

    const [orderState, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (!userInfo) {
            router.push('/login')
        }

        const fetchData = async () => {
            try {
                dispatch({ type: 'FECTH_REQUEST' })
                const { data } = await axios.get(`/api/admin/orders`, {
                    headers: {
                        authorization: `Bearer: ${userInfo.token}`
                    }
                })
                dispatch({ type: 'FETCH_SUCCESS', payload: data })
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
            }
        }

        fetchData()

    }, [])

    return (
        <Layout title="Order History">
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <NextLink selected href="/admin/dashboard" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Admin Dashboard">
                                    </ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/orders" passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="Orders">
                                    </ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/products" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Products">
                                    </ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/users" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Users">
                                    </ListItemText>
                                </ListItem>
                            </NextLink>
                        </List>
                    </Card>
                </Grid>

                <Grid item md={9} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h1" variant="h1">
                                    Orders
                                </Typography>
                            </ListItem>
                            <ListItem>
                            {
                                orderState.loading ? (
                                    <Grid container>
                                        <Skeleton animation="wave" variant="text" width={'100%'} height={50} />
                                        <Skeleton animation="wave" variant="text" width={'100%'} height={30} />
                                        <Skeleton animation="wave" variant="text" width={'100%'} height={30} />
                                    </Grid>
                                ) :
                                orderState.error ? (<Typography className={classes.error}>{orderState.error}</Typography>) : (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>USER</TableCell>
                                                    <TableCell>TITLE</TableCell>
                                                    <TableCell>DATE</TableCell>
                                                    <TableCell>TOTAL</TableCell>
                                                    <TableCell>PAID</TableCell>
                                                    <TableCell>DEILVERED</TableCell>
                                                    <TableCell>ACTION</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {
                                                orderState.orders.map((order) => (
                                                    <TableRow key={order._id}>
                                                        <TableCell>{order._id.substring(20,24)}</TableCell>
                                                        <TableCell>{order.user ? order.user.name : 'DELETED USER'}</TableCell>
                                                        <TableCell>{
                                                            order.orderItems.map(elem => elem.name + ", ")
                                                        }</TableCell>
                                                        <TableCell>{order.createdAt}</TableCell>
                                                        <TableCell>${order.totalPrice}</TableCell>
                                                        <TableCell>
                                                            {
                                                                order.isPaid ? 
                                                                `paid at ${order.paidAt}` :
                                                                `not paid`
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                order.isDelivered ? 
                                                                `delivered at ${order.deliveredAt}` :
                                                                `not delivered`
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            <NextLink href={`/order/${order._id}`} passHref>
                                                                <Button variant="contained" color='primary'>Details</Button>
                                                            </NextLink>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )
                            }
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    )
}

// to get rid of SSR at this component, use dynamic export
// in this case, the cart page will only be rendered at client side
export default dynamic(() => Promise.resolve(AdminOrders), { ssr: false })