import { Button, Card, Checkbox, CircularProgress, FormControlLabel, Grid, List, ListItem, ListItemText, TextField, Typography } from '@material-ui/core'
import NextLink from 'next/link'
import axios from 'axios'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useReducer, useState } from 'react'
import Layout from '../../../components/Layout'
import { getError } from '../../../utils/error'
import useStyles from '../../../utils/styles'
import { Store } from '../../../utils/Store'
import { Controller, useForm } from 'react-hook-form'
import { useSnackbar } from 'notistack'

const initialState = {
    loading: true,
    error: '',
    loadingUpdate: false,
    loadingUpload: false
}

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true, error: ''}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, error: ''}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload,}
        case 'UPDATE_REQUEST':
            return {...state, loadingUpdate: true, errorUpdate: '',}
        case 'UPDATE_SUCCESS':
            return {...state, loadingUpdate: false, errorUpdate: '',}
        case 'UPDATE_FAIL':
            return {...state, loadingUpdate: false, errorUpdate: action.payload,}
        case 'UPLOAD_REQUEST':
            return {...state, loadingUpload: true, errorUpload: '',}
        case 'UPLOAD_SUCCESS':
            return {...state, loadingUpload: false, errorUpload: '',}
        case 'UPLOAD_FAIL':
            return {...state, loadingUpload: false, errorUpload: action.payload,}
        default:
            return state;
    }
}

function ProductEdit({ params }) {
    const productId = params.id
    const { state } = useContext(Store)
    const { handleSubmit, control, formState: { errors }, setValue } = useForm()
    const { userInfo } = state
    const { enqueueSnackbar, closeSnackbar } = useSnackbar()
    const router = useRouter()
    const classes = useStyles()

    const [productState, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        if (!userInfo) {
            return router.push('/login')
        } else {

            const fetchData = async () => {
                try {
                    dispatch({ type: 'FECTH_REQUEST' })
                    const { data } = await axios.get(`/api/admin/products/${productId}`, {
                        headers: {
                            authorization: `Bearer: ${userInfo.token}`
                        }
                    })
                    dispatch({ type: 'FETCH_SUCCESS' })
                    setValue('name', data.name)
                    setValue('slug', data.slug)
                    setValue('price', data.price)
                    setValue('image', data.image)
                    setValue('featuredImage', data.featuredImage)
                    setIsFeatured(data.isFeatured)
                    setValue('category', data.category)
                    setValue('brand', data.brand)
                    setValue('countInStock', data.countInStock)
                    setValue('description', data.description)

                } catch (error) {
                    dispatch({ type: 'FECTH_FAIL', payload: getError(error) })
                }
            }
            fetchData()
        }
    }, [])

    const uploadHandler = async (e, imageField = 'image') => {
        const file = e.target.files[0]
        const bodyFormData = new FormData()
        bodyFormData.append('file', file)

        try {
            dispatch({ type: 'UPLOAD_REQUEST' })
            const { data } = await axios.post('/api/admin/upload', bodyFormData, {
                headers: {
                    //with this settings, we can upload files via ajax request
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer: ${userInfo.token}`
                }
            })
            dispatch({ type: 'UPLOAD_SUCCESS' })
            setValue(imageField, data.secure_url)

            enqueueSnackbar('File uploaded successfully', { variant: 'success' })
        } catch (error) {
            dispatch({ type: 'UPLOAD_FAIL', payload: getError(error) })
            enqueueSnackbar(getError(error), { variant: 'error' })
        }
    }

    const submitHandler = async ({ name, slug, price, category, image, featuredImage, brand, countInStock, description }) => {

        closeSnackbar()

        try {
            dispatch({ type: 'UPDATE_REQUEST' })
            await axios.put(`/api/admin/products/${productId}`,
                {
                    name,
                    slug,
                    price,
                    category,
                    image,
                    isFeatured,
                    featuredImage,
                    brand,
                    countInStock,
                    description
                },
                {
                    headers: {
                        authorization: `Bearer: ${userInfo.token}`
                    }
                }
            )
            dispatch({ type: 'UPDATE_SUCCESS' })
            enqueueSnackbar("Product updated successfully", { variant: 'success' })

            router.push('/admin/products')

        } catch (err) {
            dispatch({ type: 'UPDATE_FAIL', payload: getError(err) })
            enqueueSnackbar(getError(err), { variant: 'error' })
        }
    }

    const [isFeatured, setIsFeatured] = useState(false);

    return (
        <Layout title={`Edit Product ${productId}`}>
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
                            <NextLink href="/admin/users" passHref>
                                <ListItem button component="a">
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
                                <Typography component="h1" variant="h1">
                                    Edit Product ${productId}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                {productState.loading && <CircularProgress></CircularProgress>}
                                {
                                    productState.error && (
                                        <Typography className={classes.error}>{productState.error}</Typography>
                                    )
                                }
                            </ListItem>
                            <ListItem>
                                <form
                                    className={classes.form}
                                    onSubmit={handleSubmit(submitHandler)}
                                >
                                    <List>
                                        <ListItem>
                                            <Controller
                                                name="name"
                                                control={ control }
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant='outlined'
                                                        fullWidth
                                                        id='name'
                                                        label='Name'
                                                        error={Boolean(errors.name)}
                                                        helperText={errors.name ? 'Name is required' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="slug"
                                                control={ control }
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant='outlined'
                                                        fullWidth
                                                        id='slug'
                                                        label='Slug'
                                                        error={Boolean(errors.slug)}
                                                        helperText={errors.slug ? 'Slug is required' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="price"
                                                control={ control }
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant='outlined'
                                                        fullWidth
                                                        id='price'
                                                        label='Price'
                                                        error={Boolean(errors.price)}
                                                        helperText={errors.price ? 'Price is required' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="image"
                                                control={ control }
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant='outlined'
                                                        fullWidth
                                                        id='image'
                                                        label='Image'
                                                        error={Boolean(errors.image)}
                                                        helperText={errors.image ? 'Image is required' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Button variant='contained' component="label">
                                                Upload File
                                                <input type="file" onChange={uploadHandler} hidden />
                                            </Button>
                                            { productState.loadingUpload && <CircularProgress /> }
                                        </ListItem>
                                        <ListItem>
                                            <FormControlLabel
                                                label="Is Featured"
                                                control={
                                                <Checkbox
                                                    onClick={(e) => setIsFeatured(e.target.checked)}
                                                    checked={isFeatured}
                                                    name="isFeatured"
                                                />
                                                }
                                            ></FormControlLabel>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="featuredImage"
                                                control={ control }
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant='outlined'
                                                        fullWidth
                                                        id='featuredImage'
                                                        label='Featured Image'
                                                        error={Boolean(errors.image)}
                                                        helperText={errors.image ? 'Featured Image is required' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Button variant='contained' component="label">
                                                Upload File
                                                <input type="file" onChange={(e) => uploadHandler(e, 'featuredImage')} hidden />
                                            </Button>
                                            { productState.loadingUpload && <CircularProgress /> }
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="category"
                                                control={ control }
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant='outlined'
                                                        fullWidth
                                                        id='category'
                                                        label='Category'
                                                        error={Boolean(errors.category)}
                                                        helperText={errors.category ? 'Category is required' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="brand"
                                                control={ control }
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant='outlined'
                                                        fullWidth
                                                        id='brand'
                                                        label='Brand'
                                                        error={Boolean(errors.brand)}
                                                        helperText={errors.brand ? 'Brand is required' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="countInStock"
                                                control={ control }
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant='outlined'
                                                        fullWidth
                                                        id='countInStock'
                                                        label='Count in stock'
                                                        error={Boolean(errors.countInStock)}
                                                        helperText={errors.countInStock ? 'Count in stock is required' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="description"
                                                control={ control }
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant='outlined'
                                                        fullWidth
                                                        multiline
                                                        id='description'
                                                        label='Description'
                                                        error={Boolean(errors.description)}
                                                        helperText={errors.description ? 'Description is required' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Button
                                                variant='contained'
                                                type='submit'
                                                fullWidth
                                                color='primary'
                                            >
                                                Update
                                            </Button>
                                            { productState.loadingUpdate && <CircularProgress /> }
                                        </ListItem>
                                    </List>
                                </form>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    )
}

export async function getServerSideProps({ params }) {
    return {
        props: { params }
    }
}

// to get rid of SSR at this component, use dynamic export
// in this case, the cart page will only be rendered at client side
export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false })