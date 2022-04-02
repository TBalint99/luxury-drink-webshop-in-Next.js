import { Button, Link, List, ListItem, TextField, Typography } from '@material-ui/core'
import axios from 'axios'
import NextLink from 'next/link'
import React, { useState } from 'react'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'

export default function Login() {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const classes = useStyles()

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post('/api/users/login', { email, password })
            alert('Successfully logged in!')
        } catch (err) {
            console.log(err.response.data ? err.response.data.message : err.message)
            alert(err.response.data ? err.response.data.message : err.message)
        }
    }

    return (
        <Layout title="Login">
            <form
                className={classes.form}
                onSubmit={submitHandler}
            >
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
                            onChange={e => setEmail(e.target.value)}
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
                            onChange={e => setPassword(e.target.value)}
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
