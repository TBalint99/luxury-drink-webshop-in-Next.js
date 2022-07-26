import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import NextLink from 'next/link';
import { Button, Card, CircularProgress, Grid, Link, List, ListItem, TextField, Typography } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import useStyles from '../../utils/styles';
import Image from 'next/image';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';
import { getError } from '../../utils/error';
import { useSnackbar } from 'notistack';

export default function ProductScreen(props) {

    const router = useRouter()
    const { state, dispatch } = useContext(Store)
    const { userInfo } = state
    const { product } = props
    const classes = useStyles()
    const { enqueueSnackbar } = useSnackbar()

    const [userInfoState, setUserInfoState] = useState(false)
    const [reviews, setReviews] = useState([])
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
          await axios.post(
            `/api/products/${product._id}/reviews`,
            {
              rating,
              comment,
              createdAt: Date.now()
            },
            {
                headers: {
                    authorization: `Bearer: ${userInfo.token}`
                }
            }
          )
          setLoading(false)
          enqueueSnackbar('Review submitted successfully', { variant: 'success' })
          fetchReviews()
        } catch (err) {
          setLoading(false)
          enqueueSnackbar(getError(err), { variant: 'error' })
        }
      }

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`/api/products/${product._id}/reviews`)
            setReviews(data)
        } catch (error) {
            enqueueSnackbar(getError(error), { variant: 'error' })
        }
    }

    useEffect(() => {
        setUserInfoState(userInfo)
        fetchReviews()
    }, [])

    if (!product) {
        return <div>Product Not Found</div>
    }

    const addToCartHandler = async () => {
        const { data } = await axios.get(`/api/products/${product._id}`)
        
        const existItem = state.cart.cartItems.find(x => x._id === product._id)
        const quantity = existItem ? existItem.quantity + 1 : 1

        if (data.countInStock < quantity) {
            window.alert('Sorry! Product is out of stock...');
            return;
        }

        dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } })
        router.push('/cart')
    }

    return (
        <Layout title={product.name} description={product.description}>
            <div className={classes.section}>
                <NextLink href="/" passHref>
                    <Link>
                        <Typography>Back to products</Typography>
                    </Link>
                </NextLink>
            </div>
            <Grid container spacing={1}>
                <Grid item lg={4} md={4} xs={12}>
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={100}
                        height={150}
                        layout="responsive"
                    ></Image>
                </Grid>
                <Grid item lg={5} md={4} xs={12}>
                    <List>
                        <ListItem>
                            <Typography component='h1' variant='h1'>{product.name}</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>Category: {product.category}</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>Brand: {product.brand}</Typography>
                        </ListItem>
                        <ListItem>
                            <Rating value={product.rating} readOnly></Rating>
                            <Link href='#reviews'>
                                <Typography>({product.numReviews} reviews)</Typography>
                            </Link>
                        </ListItem>
                        <ListItem>
                            <Typography>Description: {product.description}</Typography>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item lg={3} md={4} xs={12}>
                    <Card>
                        <List>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={4}><Typography>Price:</Typography></Grid>
                                    <Grid item xs={8}><Typography>${product.price}</Typography></Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={4}><Typography>Status:</Typography></Grid>
                                    <Grid item xs={8}>
                                        <Typography>{product.countInStock > 0 ? 'In stock' : 'Unavailable'}</Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Button
                                    fullWidth variant='contained'
                                    color='primary'
                                    onClick={addToCartHandler}
                                >
                                    Add to cart
                                </Button>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
            <List>
                <ListItem>
                    <Typography
                        name="reviews"
                        id="reviews"
                        variant="h1"
                    >
                        Customer Reviews
                    </Typography>
                </ListItem>
                {reviews.length === 0 && <ListItem>No review</ListItem>}
                {
                    reviews.map((review) => (
                        <ListItem key={review._id}>
                            <Grid container spacing={1}>
                                <Grid item md={12} xs={12}>
                                    <Typography>
                                        <strong>{review.name}</strong>    
                                    </Typography>
                                    <Typography className={classes.date}>{Date(review.createdAt).toLocaleString('en-US').substring(0,21)}</Typography>
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <Rating value={review.rating} readOnly></Rating>
                                    <Typography>{review.comment}</Typography>
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))
                }
                <ListItem>
                    {
                        userInfoState ? (
                            <form
                                onSubmit={submitHandler}
                                className={classes.reviewForm}
                            >
                                <List>
                                    <ListItem className={classes.reviewItem}>
                                        <Typography variant='h1'>
                                            Leave your review
                                        </Typography>
                                    </ListItem>
                                    <ListItem className={classes.reviewItem}>
                                        <TextField
                                            multiline
                                            variant='outlined'
                                            fullWidth
                                            name='review'
                                            label='Enter comment'
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                    </ListItem>
                                    <ListItem className={classes.reviewItem}>
                                        <Rating
                                            name="simple-controlled"
                                            value={rating}
                                            onChange={(e) => setRating(Number(e.target.value))}
                                        />
                                    </ListItem>
                                    <Button
                                        type='submit'
                                        fullWidth
                                        variant='contained'
                                        color='primary'
                                    >
                                        Submit
                                    </Button>
                                    {loading && <CircularProgress></CircularProgress>}
                                </List>
                            </form>
                        ) : (
                            <Typography variant='h1'>
                                Please
                                {' '}
                                <Link
                                    href={`/login?redirect=/product/${product.slug}`}
                                >
                                    login
                                </Link>
                                {' '}
                                to write review
                            </Typography>
                        )
                    }
                </ListItem>
            </List>
        </Layout>
    )
}

export async function getServerSideProps(context) {

    const { params } = context
    const { slug } = params

    await db.connect()
    const product = await Product.findOne({ slug }, '-reviews').lean()
    await db.disconnect()
  
    return {
      props: {
        product: db.convertDocToObj(product)
      }
    }
}