import { Button, Card, CircularProgress, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core'
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
import { useSnackbar } from 'notistack'

const initialState = {
    loading: true,
    users: [],
    error: '',
    loadingCreate: false,
    successDelete: false,
    loadingDelete: false
}

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true, error: ''}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, users: action.payload,  error: ''}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload,}
        case 'CREATE_REQUEST':
            return {...state, loadingCreate: true }
        case 'CREATE_SUCCESS':
            return {...state, loadingCreate: false }
        case 'CREATE_FAIL':
            return {...state, loadingCreate: false }
        case 'DELETE_REQUEST':
            return {...state, loadingDelete: true }
        case 'DELETE_SUCCESS':
            return {...state, loadingDelete: false, successDelete: true }
        case 'DELETE_FAIL':
            return {...state, loadingDelete: false }
        case 'DELETE_RESET':
            return {...state, loadingDelete: false, successDelete: false }
        default:
            return state;
    }
}

function AdminDashboard() {
    const { state } = useContext(Store)
    const { userInfo } = state
    const router = useRouter()
    const classes = useStyles()

    const [userState, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (!userInfo) {
            router.push('/login')
        }

        const fetchData = async () => {
            try {
                dispatch({ type: 'FECTH_REQUEST' })
                const { data } = await axios.get(`/api/admin/users`, {
                    headers: {
                        authorization: `Bearer: ${userInfo.token}`
                    }
                })
                dispatch({ type: 'FETCH_SUCCESS', payload: data })
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
            }
        }

        if (userState.successDelete) {
            dispatch({ type: 'DELETE_RESET' })
        } else {
            fetchData()
        }

    }, [userState.successDelete])

    const { enqueueSnackbar } = useSnackbar()
    const createHandler = async () => {
        if (!window.confirm('Are you sure to add user?')) {
            return
        }

        try {
            dispatch({ type: 'CREATE_REQUEST' })
            const { data } = await axios.post(
                `/api/admin/users`,
                {},
                {
                    headers: {
                        authorization: `Bearer: ${userInfo.token}`
                    }
                }
            )
            dispatch({ type: 'CREATE_SUCCESS' })
            enqueueSnackbar('User created successfully', { variant: 'success' })
            router.push(`/admin/user/${data.user._id}`)
        } catch (error) {
            dispatch({ type: 'CREATE_FAIL' })
            enqueueSnackbar(getError(error), { variant: 'error' })
        }
    }

    const deleteHandler = async (userId) => {
        if (!window.confirm('Are you sure to delete this user?')) {
            return
        }

        try {
            dispatch({ type: 'DELETE_REQUEST' })
            await axios.delete(
                `/api/admin/users/${userId}`,
                {
                    headers: {
                        authorization: `Bearer: ${userInfo.token}`
                    }
                }
            )
            dispatch({ type: 'DELETE_SUCCESS' })
            enqueueSnackbar('User deleted successfully', { variant: 'success' })
        } catch (error) {
            dispatch({ type: 'DELETE_FAIL' })
            enqueueSnackbar(getError(error), { variant: 'error' })
        }
    }

    return (
        <Layout title="User History">
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
                            <NextLink href="/admin/users" passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="Users">
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
                                <Grid container>
                                    <Grid item xs={6} alignItems="center">
                                        <Typography component="h1" variant="h1">
                                            Users
                                        </Typography>
                                        { userState.loadingDelete && <CircularProgress />}
                                    </Grid>
                                    <Grid item xs={6} align="right">
                                        <Button
                                            onClick={createHandler}
                                            color="primary"
                                            variant="contained"
                                        >
                                            Create
                                        </Button>
                                        { userState.loadingCreate && <CircularProgress /> }
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                            {
                                userState.loading ? (
                                    <Grid container>
                                        <Skeleton animation="wave" variant="text" width={'100%'} height={50} />
                                        <Skeleton animation="wave" variant="text" width={'100%'} height={30} />
                                        <Skeleton animation="wave" variant="text" width={'100%'} height={30} />
                                    </Grid>
                                ) :
                                userState.error ? (<Typography className={classes.error}>{userState.error}</Typography>) : (
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
                                                userState.users.map((user) => (
                                                    <TableRow key={user._id}>
                                                        <TableCell>{user._id.substring(20, 24)}</TableCell>
                                                        <TableCell>{user.name}</TableCell>
                                                        <TableCell>${user.price}</TableCell>
                                                        <TableCell>{user.category}</TableCell>
                                                        <TableCell>{user.countInStock}</TableCell>
                                                        <TableCell>{user.rating}</TableCell>
                                                        <TableCell>
                                                            <NextLink href={`/admin/user/${user._id}`} passHref>
                                                                <Button
                                                                    size='small'
                                                                    variant="contained"
                                                                    color='primary'
                                                                    style={{marginRight: '.9em'}}
                                                                >Edit</Button>
                                                            </NextLink>
                                                            <Button
                                                                size='small'
                                                                variant="outlined"
                                                                color='secondary'
                                                                onClick={() => deleteHandler(user._id)}
                                                            >Delete</Button>
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