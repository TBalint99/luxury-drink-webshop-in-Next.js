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
    products: [],
    error: ''
}

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true, error: ''}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, products: action.payload,  error: ''}
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

    const [productState, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (!userInfo) {
            router.push('/login')
        }

        const fetchData = async () => {
            try {
                dispatch({ type: 'FECTH_REQUEST' })
                const { data } = await axios.get(`/api/admin/products`, {
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
        <Layout title="Product History">
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
                                <ListItem button component="a">
                                    <ListItemText primary="Orders">
                                    </ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/products" passHref>
                                <ListItem selected button component="a">
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
                                <Typography component="h1" variant="h1">
                                    Products
                                </Typography>
                            </ListItem>
                            <ListItem>
                            {
                                productState.loading ? (
                                    <Grid container>
                                        <Skeleton animation="wave" variant="text" width={'100%'} height={50} />
                                        <Skeleton animation="wave" variant="text" width={'100%'} height={30} />
                                        <Skeleton animation="wave" variant="text" width={'100%'} height={30} />
                                    </Grid>
                                ) :
                                productState.error ? (<Typography className={classes.error}>{productState.error}</Typography>) : (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>NAME</TableCell>
                                                    <TableCell>PRICE</TableCell>
                                                    <TableCell>CATEGORY</TableCell>
                                                    <TableCell>COUNT</TableCell>
                                                    <TableCell>RATING</TableCell>
                                                    <TableCell>ACTIONS</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {
                                                productState.products.map((product) => (
                                                    <TableRow key={product._id}>
                                                        <TableCell>{product._id.substring(20, 24)}</TableCell>
                                                        <TableCell>{product.name}</TableCell>
                                                        <TableCell>${product.price}</TableCell>
                                                        <TableCell>{product.category}</TableCell>
                                                        <TableCell>{product.countInStock}</TableCell>
                                                        <TableCell>{product.rating}</TableCell>
                                                        <TableCell>
                                                            <NextLink href={`/admin/product/${product._id}`} passHref>
                                                                <Button
                                                                    size='small'
                                                                    variant="contained"
                                                                    color='primary'
                                                                    style={{marginRight: '.9em'}}
                                                                >Edit</Button>
                                                            </NextLink>
                                                            <Button size='small' variant="contained" color='primary'>Delete</Button>
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
export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false })