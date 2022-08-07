import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link'
import { AppBar, Toolbar, Typography, Container, Link, ThemeProvider, CssBaseline, Switch, Badge, Button, Menu, MenuItem, useMediaQuery, useTheme, IconButton, createTheme, Box, Drawer, List, ListItem, Divider, ListItemText } from '@material-ui/core';
import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
import { getError } from '../utils/error';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import MenuIcon from '@material-ui/icons/Menu';
import CancelIcon from '@material-ui/icons/Cancel';
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import { useSnackbar } from 'notistack';
import axios from 'axios';

export default function Layout({ title, children, description }) {

    const router = useRouter()
    const { state, dispatch } = useContext(Store)
    const { darkMode, cart, userInfo } = state

    const theme = createTheme({
        typography: {
            h1: {
                fontSize: '1.6rem',
                fontWeight: 400,
                margin: '1rem 0'
            },
            h2: {
                fontSize: '1.4rem',
                fontWeight: 400,
                margin: '1rem 0'
            },
        },
        palette: {
            type: darkMode ? 'dark' : 'light',
            primary: {
                main: '#35858B',
            },
            secondary: {
                main: '#AEFEFF'
            }
        }
    })

    const classes = useStyles()

    const darkModeChangeHandler = () => {
        dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' })

        const newDarkMode = !darkMode
        Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF') 
    }

    // everytime the darkMode value changes, it will automatically apply the selected mode
    const [darkModeValue, setDarkModeValue] = useState(false)
    const [badgeValue, setBadgeValue] = useState("Cart")
    const [badgeValueMobile, setBadgeValueMobile] = useState("")
    const [userInfoValue, setUserInfoValue] = useState(null)
    const [sidebarVisible, setSidebarVisible] = useState(false)
    const [categories, setCategories] = useState([])

    const themeValue = useTheme()
    const isMobile = useMediaQuery(themeValue.breakpoints.down("xs"))

    
    const { enqueueSnackbar } = useSnackbar()

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`/api/products/categories`)
            setCategories(data)
        } catch (error) {
            enqueueSnackbar(getError(error), { variant: 'error' })
        }
    }

    useEffect(() => {
        setDarkModeValue(darkMode)
        setBadgeValue(
            cart.cartItems.length > 0 ?
            <Badge
                badgeContent={cart.cartItems.length}
                color='secondary'
                overlap='rectangular'
            ><Typography component='span'>Cart</Typography></Badge>
            : <Typography component='span'>Cart</Typography>
        )
        setBadgeValueMobile(
            cart.cartItems.length > 0 ?
            <Badge
                badgeContent={cart.cartItems.length}
                color='secondary'
                overlap='rectangular'
            ><ShoppingCartIcon /></Badge>
            : ""
        )
        if (userInfo) {
            setUserInfoValue(userInfo)
        }
        fetchCategories()
    }, [darkMode, cart, userInfo])

    const [ anchorEl, setAnchorEl ] = useState(null)

    const loginClickHandler = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const loginMenuCloseHandler = () => {
        setAnchorEl(null)
    }

    const logoutClickHandler = () => {
        router.push('/')
        setAnchorEl(null)
        setUserInfoValue(null)
        dispatch({ type: 'USER_LOGOUT' })
        Cookies.remove('userInfo')
        Cookies.remove('cartItems')
        Cookies.remove('paymentMethod')
        Cookies.remove('shippingAddress')
    }

    const sidebbarOpenHandler = () => {
        setSidebarVisible(true)
    }

    const sidebarCloseHandler = () => {
        setSidebarVisible(false)
    }

    return (
        <div>
            <Head>
                <title>{title ? `${title} - NextDrinks` : 'NextDrinks'}</title>
                {description && <meta name='description' content={description}></meta>}
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="static" className={classes.navbar}>
                    <Toolbar className={classes.toolbar}>
                        <Box display='flex' alignItems='center'>
                            <IconButton
                                edge='start'
                                aria-label='open drawer'
                                onClick={sidebbarOpenHandler}
                            >
                                {
                                    isMobile ? (
                                        <LocalOfferIcon color='secondary' className={classes.navbarButton} />
                                    ) : (
                                        <MenuIcon color='secondary' className={classes.navbarButton} />
                                    )
                                }
                                
                            </IconButton>
                            <NextLink href="/" passHref>
                            <Link>
                                <Typography className={classes.brand} color='secondary'>NextDrinks</Typography>
                            </Link>
                            </NextLink>
                        </Box>
                        <Drawer
                            anchor='left'
                            open={sidebarVisible}
                            onClose={sidebarCloseHandler}
                        >
                            <List>
                                <ListItem>
                                    <Box
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='space-between'
                                    >
                                        <Typography>Shopping by category</Typography>
                                        <IconButton
                                            aria-label='close'
                                            onClick={sidebarCloseHandler}
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                                <Divider light />
                                {
                                    categories.map((category) => (
                                        <NextLink
                                            key={category}
                                            href={`/search?category=${category}`}
                                            passHref
                                        >
                                            <ListItem
                                                button
                                                component='a'
                                                onClick={sidebarCloseHandler}
                                            >
                                                <ListItemText primary={category}></ListItemText>
                                            </ListItem>
                                        </NextLink>
                                    ))
                                }
                            </List>
                        </Drawer>
                        {
                            isMobile ? (
                                <>
                                    <div className={classes.grow}></div>
                                    <Switch checked={darkModeValue} onChange={darkModeChangeHandler}></Switch>
                                    <div className={classes.grow}></div>
                                    <div className={classes.linkContainer}>
                                        <NextLink href="/cart" passHref>
                                            <Link color='secondary' component="button">
                                                {badgeValueMobile}
                                            </Link>
                                        </NextLink>
                                        {
                                            userInfoValue ? (
                                                <>
                                                    <IconButton
                                                        className={classes.navbarButton}
                                                        color='secondary'
                                                        aria-controls="simple-menu"
                                                        aria-haspopup="true"
                                                        onClick={loginClickHandler}
                                                    ><MenuIcon /></IconButton>
                                                    <Menu
                                                        id="simple-menu"
                                                        anchorEl={anchorEl}
                                                        keepMounted
                                                        open={Boolean(anchorEl)}
                                                        onClose={loginMenuCloseHandler}
                                                    >
                                                        <MenuItem onClick={
                                                            () => {
                                                                loginMenuCloseHandler()
                                                                router.push('/profile')
                                                            }
                                                        }>Profile</MenuItem>
                                                        <MenuItem onClick={
                                                            () => {
                                                                loginMenuCloseHandler()
                                                                router.push('/order-history')
                                                            }
                                                        }>Order History</MenuItem>
                                                        {
                                                            userInfoValue.isAdmin && (
                                                                <MenuItem onClick={
                                                                    () => {
                                                                        loginMenuCloseHandler()
                                                                        router.push('/admin/dashboard')
                                                                    }
                                                                }>Admin Dadhboard</MenuItem>
                                                            )
                                                        }
                                                        <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                                                    </Menu>
                                                </>
                                            ) : (
                                                <NextLink href="/login" passHref>

                                                    <Link color='secondary' component="button">
                                                        <Typography component='span'>
                                                            Login
                                                        </Typography>
                                                    </Link>
                                                </NextLink>
                                            )
                                        }
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className={classes.grow}></div>
                                    <div className={classes.linkContainer}>
                                        <Switch checked={darkModeValue} onChange={darkModeChangeHandler}></Switch>
                                        <NextLink href="/cart" passHref>
                                            <Link color='secondary' component="button">
                                                {badgeValue}
                                            </Link>
                                        </NextLink>
                                        {
                                            userInfoValue ? (
                                                <>
                                                    <Button
                                                        className={classes.navbarButton}
                                                        color='secondary'
                                                        aria-controls="simple-menu"
                                                        aria-haspopup="true"
                                                        onClick={loginClickHandler}
                                                    >
                                                        <Typography component='span'>
                                                            {userInfoValue.name}
                                                        </Typography>
                                                    </Button>
                                                    <Menu
                                                        id="simple-menu"
                                                        anchorEl={anchorEl}
                                                        keepMounted
                                                        open={Boolean(anchorEl)}
                                                        onClose={loginMenuCloseHandler}
                                                    >
                                                        <MenuItem onClick={
                                                            () => {
                                                                loginMenuCloseHandler()
                                                                router.push('/profile')
                                                            }
                                                        }>Profile</MenuItem>
                                                        <MenuItem onClick={
                                                            () => {
                                                                loginMenuCloseHandler()
                                                                router.push('/order-history')
                                                            }
                                                        }>Order History</MenuItem>
                                                        {
                                                            userInfoValue.isAdmin && (
                                                                <MenuItem onClick={
                                                                    () => {
                                                                        loginMenuCloseHandler()
                                                                        router.push('/admin/dashboard')
                                                                    }
                                                                }>Admin Dadhboard</MenuItem>
                                                            )
                                                        }
                                                        <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                                                    </Menu>
                                                </>
                                            ) : (
                                                <NextLink href="/login" passHref>
                                                    <Link color='secondary' component="button">
                                                        <Typography component='span'>
                                                            Login
                                                        </Typography>
                                                    </Link>
                                                </NextLink>
                                            )
                                        }
                                    </div>
                                </>
                            )
                        }
                    </Toolbar>
                </AppBar>
                <Container
                    className={classes.main}
                >
                    {children}
                </Container>
                <footer
                    className={classes.footer}
                >
                    <Typography>All rights reserved. Next Amazona.</Typography>
                </footer>
            </ThemeProvider>
        </div>
    );
}
