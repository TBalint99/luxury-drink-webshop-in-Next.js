import { Button, Card, CardActions, CardContent, Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core'
import { Bar } from 'react-chartjs-2'
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
    summary: { salesData: [] },
    error: ''
}

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true, error: ''}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, summary: action.payload,  error: ''}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload,}
        default:
            return state;
    }
}

function AdminDashboard() {
    const { state } = useContext(Store)
    const { userInfo } = state
    const router = useRouter()
    const classes = useStyles()

    const [summaryState, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (!userInfo) {
            router.push('/login')
        }

        const fetchData = async () => {
            try {
                dispatch({ type: 'FECTH_REQUEST' })
                const { data } = await axios.get(`/api/admin/summary`, {
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
                                <ListItem selected button component="a">
                                    <ListItemText primary="Admin Dashboard">
                                    </ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/orders" passHref>
                                <ListItem button component="a">
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
                        </List>
                    </Card>
                </Grid>

                <Grid item md={9} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                            {
                                summaryState.loading ? (
                                    <Grid container>
                                        <Skeleton animation="wave" variant="text" width={'100%'} height={50} />
                                        <Skeleton animation="wave" variant="text" width={'100%'} height={30} />
                                        <Skeleton animation="wave" variant="text" width={'100%'} height={30} />
                                    </Grid>
                                ) :
                                summaryState.error ? (<Typography className={classes.error}>{summaryState.error}</Typography>) : (
                                    <Grid container spacing={5}>
                                        <Grid item md={3} xs={12}>
                                            <Card raised>
                                                <CardContent>
                                                    <Typography variant='h1'>
                                                        ${summaryState.summary.ordersPrice}
                                                    </Typography>
                                                    <Typography>
                                                        Sales
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <NextLink href="/admin/orders" passHref>
                                                        <Button size="small" color="primary">
                                                            View sales
                                                        </Button>
                                                    </NextLink>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                        <Grid item md={3} xs={12}>
                                            <Card raised>
                                                <CardContent>
                                                    <Typography variant='h1'>
                                                        {summaryState.summary.ordersCount}
                                                    </Typography>
                                                    <Typography>
                                                        Orders
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <NextLink href="/admin/orders" passHref>
                                                        <Button size="small" color="primary">
                                                            View orders
                                                        </Button>
                                                    </NextLink>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                        <Grid item md={3} xs={12}>
                                            <Card raised>
                                                <CardContent>
                                                    <Typography variant='h1'>
                                                        {summaryState.summary.productsCount}
                                                    </Typography>
                                                    <Typography>
                                                        Products
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <NextLink href="/admin/products" passHref>
                                                        <Button size="small" color="primary">
                                                            View products
                                                        </Button>
                                                    </NextLink>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                        <Grid item md={3} xs={12}>
                                            <Card raised>
                                                <CardContent>
                                                    <Typography variant='h1'>
                                                        {summaryState.summary.usersCount}
                                                    </Typography>
                                                    <Typography>
                                                        Users
                                                    </Typography>
                                                </CardContent>
                                                <CardActions>
                                                    <NextLink href="/admin/users" passHref>
                                                        <Button size="small" color="primary">
                                                            View users
                                                        </Button>
                                                    </NextLink>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                )
                            }
                            </ListItem>
                            <ListItem>
                                <Typography component="h1" variant="h1">
                                    Sales Chart
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Bar 
                                    data={{
                                        labels: summaryState.summary.salesData.map((x) => x._id),
                                        datasets: [
                                            {
                                                label: 'Sales',
                                                backgroundColor: 'rgba(162, 222, 208, 1)',
                                                data: summaryState.summary.salesData.map((x) => x.totalSales)
                                            }
                                        ]
                                    }}
                                    options={{
                                        legend: { display: true, position: 'right' }
                                    }}
                                ></Bar>
                                
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
export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false })