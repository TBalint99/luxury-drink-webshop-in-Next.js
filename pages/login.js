import { Button, Link, List, ListItem, TextField, Typography } from '@material-ui/core'
import NextLink from 'next/link'
import React from 'react'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'

export default function Login() {
    
    const classes = useStyles()

    return (
        <Layout title="Login">
            <form className={classes.form}>
                <Typography component='h1' variant='h1'>
                    Login
                </Typography>
                <List>
                    <ListItem>
                        <TextField
                            variant='outlined'
                            fullWidth
                            id='email'
                            label='E-mail'
                            inputProps={{ type: 'email' }}
                        >
                        </TextField>
                    </ListItem>
                    <ListItem>
                        <TextField
                            variant='outlined'
                            fullWidth
                            id='password'
                            label='Password'
                            inputProps={{ type: 'password' }}
                        >
                        </TextField>
                    </ListItem>
                    <ListItem>
                        <Button
                            variant='contained'
                            type='submit'
                            fullWidth
                            color='primary'
                        >
                            Login
                        </Button>
                    </ListItem>
                    <ListItem>
                        Don't have account? &nbsp; <NextLink href='/signup' passHref><Link>Sign Up</Link></NextLink>
                    </ListItem>
                </List>
            </form>
        </Layout>
  )
}
