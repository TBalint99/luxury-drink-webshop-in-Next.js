import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Link, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import dynamic from 'next/dynamic'
import Layout from '../../components/Layout'
import { Store } from '../../utils/Store'
import NextLink from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useStyles from '../../utils/styles'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CheckoutWizard from '../../components/CheckoutWizard'
import { getError } from '../../utils/error'
import axios from 'axios'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { useSnackbar } from 'notistack'

const initialState = {
    loading: true,
    order: {},
    error: ''
}

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true, error: ''}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, order: action.payload,  error: ''}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload,}
        case 'PAY_REQUEST':
            return {...state, loadingPay: true}
        case 'PAY_SUCCESS':
            return {...state, loadingPay: false, successPay: true}
        case 'PAY_FAIL':
            return {...state, loadingPay: false, errorPay: action.payload}
        case 'PAY_RESET':
            return {...state, loadingPay: false, successPay: false, errorPay: ''}
        case 'DELIVER_REQUEST':
            return {...state, loadingDeliver: true}
        case 'DELIVER_SUCCESS':
            return {...state, loadingDeliver: false, successDeliver: true}
        case 'DELIVER_FAIL':
            return {...state, loadingDeliver: false, errorDeliver: action.payload}
        case 'DELIVER_RESET':
            return {...state, loadingDeliver: false, successDeliver: false, errorDeliver: ''}
        default:
            return state;
    }
}

function Order({ params }) {
  const orderId = params.id
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
  const classes = useStyles()
  const router = useRouter()
  const { state } = useContext(Store)
  const { userInfo } = state
  const { enqueueSnackbar } = useSnackbar()

  const [orderState, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {

    if (!userInfo) {
        return router.push('/login')
    }

    const fetchOrder = async () => {
        try {
            dispatch({ type: 'FECTH_REQUEST' })
            const { data } = await axios.get(`/api/orders/${orderId}`, {
                headers: {
                    authorization: `Bearer: ${userInfo.token}`
                }
            })
            dispatch({ type: 'FETCH_SUCCESS', payload: data })
        } catch (err) {
            dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
        }
    }

    if (!orderState.order._id || orderState.succesPay || orderState.successDeliver || (orderState.order._id && orderState.order._id !== orderId)) {
        fetchOrder()
        
        //console.log(orderState.loadingDeliver);

        if(orderState.succesPay) {
            dispatch({ type: 'PAY_RESET' })
        }

        if(orderState.successDeliver) {
            dispatch({ type: 'DELIVER_RESET' })
        }
    } else {
        const loadPaypalScript = async () => {
            const { data: clientId } = await axios.get('/api/keys/paypal', {
                headers: {
                    authorization: `Bearer: ${userInfo.token}`
                }
            })

            paypalDispatch({
                type: 'resetOptions',
                value: {
                    'client-id': clientId,
                    currency: 'USD'
                }
            })

            paypalDispatch({
                type: 'setLoadingStatus',
                value: 'pending'
            })
        }
        loadPaypalScript()
    }

  }, [orderState.order, orderState.successPay, orderState.successDeliver])

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
    loadingDeliver
  } = orderState.order

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const createOrder = (data, actions) => {
    return actions.order.create({
        purchase_units: [
            {
                amount: { value: totalPrice }
            }
        ]
    }).then((orderId) => {
        return orderId
    })
  }

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
        try {
            dispatch({ type: 'PAY_REQUEST' })
            const { data } = await axios.put(`/api/orders/${orderState.order._id}/pay`, details, {
                headers: {
                    authorization: `Bearer: ${userInfo.token}`
                }
            })
            dispatch({ type: 'PAY_SUCCESS', payload: data })
            enqueueSnackbar('Order is paid', { variant: 'success' })
        } catch (error) {
            dispatch({ type: 'PAY_FAIL', payload: getError(error) })
            enqueueSnackbar(getError(error), { variant: 'error' })
        }
    })
  }

  const onError = (error) => { 
    enqueueSnackbar(getError(error), { variant: 'error' })
  }

  const deliverOrderHandler = async () => {
    try {
        dispatch({ type: 'DELIVER_REQUEST' })
        const { data } = await axios.put(`/api/orders/${orderState.order._id}/deliver`, {}, {
            headers: {
                authorization: `Bearer: ${userInfo.token}`
            }
        })
        dispatch({ type: 'DELIVER_SUCCESS', payload: data })
        enqueueSnackbar('Order is delivered', { variant: 'success' })
    } catch (error) {
        dispatch({ type: 'DELIVER_FAIL', payload: getError(error) })
        enqueueSnackbar(getError(error), { variant: 'error' })
    }
  }

  return (
    <Layout title={`Order ${orderId}`}>
        <CheckoutWizard activeStep={3}></CheckoutWizard>
        <Typography component="h1" variant="h1">
        <IconButton onClick={handleClickOpen} className={classes.backicon}>
            <ArrowBackIosIcon />
        </IconButton>
        <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to step back?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Your order has been confirmed, so if you go back to the previous page, the contents of your cart will be empty.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        No
                    </Button>
                    <Button onClick={() => router.back()} color="secondary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
        </Dialog>
        Order {orderId}
        </Typography>
        {
            orderState.loading ? (<CircularProgress />) :
            orderState.error ? (<Typography className={classes.error}>{orderState.error}</Typography>) :
            <Grid container spacing={1}>
                <Grid item md={9} xs={12}>
                <Card className={classes.section}>
                    <List>
                        <ListItem>
                        <Typography component='h2' variant='h2'>
                            Shipping Address
                        </Typography>
                        </ListItem>
                        <ListItem>
                            {shippingAddress.fullName},
                            {shippingAddress.address},
                            {' '},
                            {shippingAddress.city},
                            {shippingAddress.postalCode},
                            {' '},
                            {shippingAddress.country}
                        </ListItem>
                        <ListItem>
                            Status: {' '}
                            {
                                isDelivered ?
                                `delivered at ${deliveredAt}` :
                                'not delivered yet'
                            }
                        </ListItem>
                    </List>
                    </Card>
                    <Card className={classes.section}>
                    <List>
                        <ListItem>
                        <Typography component='h2' variant='h2'>
                            Payment Method
                        </Typography>
                        </ListItem>
                        <ListItem>{paymentMethod}</ListItem>
                        <ListItem>
                            Status: {' '}
                            {
                                isPaid ?
                                `paid at ${paidAt}` :
                                'not paid yet'
                            }
                        </ListItem>
                    </List>
                    </Card>
                    <Card className={classes.section}>
                    <List>
                        <ListItem>
                        <Typography component='h2' variant='h2'>
                            Order Items
                        </Typography>
                        </ListItem>
                        <ListItem>
                        <TableContainer>
                            <Table>
                            <TableHead>
                                <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell align='right'>Quantity</TableCell>
                                <TableCell align='right'>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    orderItems.map((item) => (
                                        <TableRow key={item._id}>
                                        <TableCell>
                                            <NextLink href={`/product/${item.slug}`} passHref>
                                            <Link>
                                                <Image src={item.image} alt={item.name} width={50} height={75}></Image>
                                            </Link>
                                            </NextLink>
                                        </TableCell>

                                        <TableCell>
                                            <NextLink href={`/product/${item.slug}`} passHref>
                                            <Link>
                                                <Typography>{item.name}</Typography>
                                            </Link>
                                            </NextLink>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Typography>{item.quantity}</Typography>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Typography>${item.price}</Typography>
                                        </TableCell>

                                        <TableCell align='right'>
                                        </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                            </Table>
                        </TableContainer>
                        </ListItem>
                    </List>

                    </Card>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Card className={classes.section}>
                    <List>
                        <ListItem>
                            <Typography variant='h2'>
                            Order Summary
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Grid container>
                                <Grid item xs={6}>
                                <Typography>
                                    Items: 
                                </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                <Typography align='right'>
                                    ${itemsPrice} 
                                </Typography>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid container>
                                <Grid item xs={6}>
                                <Typography>
                                    Tax: 
                                </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                <Typography align='right'>
                                    ${taxPrice} 
                                </Typography>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid container>
                                <Grid item xs={6}>
                                <Typography>
                                    Shipping: 
                                </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                <Typography align='right'>
                                    ${shippingPrice} 
                                </Typography>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid container>
                                <Grid item xs={6}>
                                <Typography>
                                    <strong>Total:</strong> 
                                </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                <Typography align='right'>
                                    <strong>${totalPrice}</strong> 
                                </Typography>
                                </Grid>
                            </Grid>
                        </ListItem> 
                        {
                            !isPaid && (
                                <ListItem>
                                    {
                                        isPending ?
                                        <CircularProgress /> :
                                        (
                                            <div className={classes.fullWidth}>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                ></PayPalButtons>
                                            </div>
                                            
                                        )
                                    }
                                </ListItem>  
                            )
                        }
                        {
                            userInfo.isAdmin && isPaid && !isDelivered && (
                                <ListItem>
                                    {loadingDeliver && <CircularProgress />}
                                    <Button
                                        fullWidth
                                        variant='contained'
                                        color='primary'
                                        onClick={deliverOrderHandler}
                                    >
                                        Deliver Order
                                    </Button>
                                </ListItem>
                            )
                        }
                    </List>
                    </Card>
                </Grid>
            </Grid>
        }
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
    return { props: { params } }
}

// to get rid of SSR at this component, use dynamic export
// in this case, the cart page will only be rendered at client side
export default dynamic(() => Promise.resolve(Order), { ssr: false })