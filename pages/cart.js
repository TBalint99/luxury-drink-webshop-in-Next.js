import { Button, Card, Grid, Link, List, ListItem, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
import React, { useContext, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import NextLink from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/router'

function CartScreen() {
  const router = useRouter()
  const { state, dispatch } = useContext(Store)
  const { cart: { cartItems } } = state
  const [cartItemState, setCartItemState] = useState([])
  const mountedRef = useRef(true)

  useEffect(() => {
    setCartItemState(cartItems)
    mountedRef.current = false
  },[cartItems, cartItemState])

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`)
        
    if (data.countInStock <= 0) {
        window.alert('Sorry! Product is out of stock...');
        return;
    }
    
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } })
  }

  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item })
  }

  const checkoutHandler = () => {
    router.push('/shipping')
  }

  return (
    <Layout title="Shopping Cart">
      <Typography component="h1" variant="h1">Shopping Cart</Typography>
      {
        cartItemState.length === 0 ? (
          <div>
            Cart is empty. &nbsp;
            <NextLink href="/" passHref>
              <Link>
                Go shopping!
              </Link>

            </NextLink>
          </div>
        ) : (
          <Grid container spacing={1}>
            <Grid item md={9} xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align='right'>Quantity</TableCell>
                      <TableCell align='right'>Price</TableCell>
                      <TableCell align='right'>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      cartItemState.map((item) => (
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
                            <Select value={item.quantity} onChange={(e) =>
                              updateCartHandler(item, e.target.value)
                            }>
                              {[...Array(item.countInStock).keys()].map((x) => (
                                <MenuItem key={x + 1} value={x + 1}>
                                  {x + 1}
                                </MenuItem>
                              ))}
                            </Select>
                          </TableCell>

                          <TableCell align='right'>
                            ${item.price}
                          </TableCell>

                          <TableCell align='right'>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => removeItemHandler(item)}
                            >x</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                    <ListItem>
                      <Typography variant='h2'>
                        Subtotal ({cartItemState.reduce((a, c) => a + c.quantity, 0)}{' '} items) : $
                        {cartItemState.reduce((a, c) => a + c.quantity * c.price, 0)}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Button
                        variant='contained'
                        color='primary'
                        fullWidth
                        onClick={checkoutHandler}
                      >
                        Check Out
                      </Button>
                    </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        )
      }
    </Layout>
  )
}

// to get rid of SSR at this component, use dynamic export
// in this case, the cart page will only be rendered at client side
export default dynamic(() => Promise.resolve(CartScreen), { ssr: false })