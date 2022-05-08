import { Button, Card, Grid, IconButton, Link, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import NextLink from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useStyles from '../utils/styles'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CheckoutWizard from '../components/CheckoutWizard'

function PlaceOrder() {
  const classes = useStyles()
  const router = useRouter()
  const { state } = useContext(Store)
  const { cart: { cartItems, shippingAddress, paymentMethod } } = state
  const [shippingAddressValue, setShippingAddressValue] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  })

  const roundTwoDecimals = (num) => Math.round(num*100 + Number.EPSILON) / 100 

  const itemsPrice = roundTwoDecimals(cartItems.reduce((a, c) => a + c.price * c.quantity, 0))
  const shippingPrice = itemsPrice > 200 ? 0 : 15
  const taxPrice = roundTwoDecimals(itemsPrice * 0.27)
  const totalPrice = roundTwoDecimals(itemsPrice + shippingPrice + taxPrice) 

  useEffect(() => {

    if(cartItems.length === 0) {
      alert('Your cart is empty!')
      router.push('/') 
    } else if(!paymentMethod) {
        router.push('/payment')
    }

    if(shippingAddress) {
      setShippingAddressValue(shippingAddress)
    }

  }, [shippingAddress])

  return (
    <Layout title="Shopping Cart">
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <Typography component="h1" variant="h1">
        <IconButton onClick={() => router.back()} className={classes.backicon}>
          <ArrowBackIosIcon />
        </IconButton>
        Place Order
      </Typography>
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
                  {shippingAddressValue.fullName},
                  {shippingAddressValue.address},
                  {' '},
                  {shippingAddressValue.city},
                  {shippingAddressValue.postalCode},
                  {' '},
                  {shippingAddressValue.country}
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
                          cartItems.map((item) => (
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
                  <ListItem>
                    <Button
                      variant='contained'
                      color='primary'
                      fullWidth
                    >
                      Place Order
                    </Button>
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
export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false })