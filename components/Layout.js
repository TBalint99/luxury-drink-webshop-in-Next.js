import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link'
import { AppBar, Toolbar, Typography, Container, Link, createMuiTheme, ThemeProvider, CssBaseline, Switch } from '@material-ui/core';
import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';

export default function Layout({ title, children, description }) {

    const { state, dispatch } = useContext(Store)
    const { darkMode } = state

    const theme = createMuiTheme({
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
    useEffect(() => setDarkModeValue(darkMode), [darkMode])


    return (
    <div>
        <Head>
            <title>{title ? `${title} - NextDrinks` : 'NextDrinks'}</title>
            {description && <meta name='description' content={description}></meta>}
        </Head>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" className={classes.navbar}>
                <Toolbar>
                    <NextLink href="/" passHref>
                        <Link>
                            <Typography className={classes.brand} color='secondary'>NextDrinks</Typography>
                        </Link>
                    </NextLink>
                    <div className={classes.grow}></div>
                    <div className={classes.linkContainer}>
                        <Switch checked={darkModeValue} onChange={darkModeChangeHandler}></Switch>
                        <NextLink href="/cart" passHref>
                            <Link color='secondary' component="button">Cart</Link>
                        </NextLink>
                        <NextLink href="/login" passHref>
                            <Link color='secondary' component="button">Login</Link>
                        </NextLink>
                    </div>
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
