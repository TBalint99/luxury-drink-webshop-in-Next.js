import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@material-ui/core'
import React from 'react'
import NextLink from 'next/link'
import { Rating } from '@material-ui/lab'

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <Card>
        <NextLink href={`/product/${product.slug}`} passHref>
            <CardActionArea>
            <CardMedia
                component="img"
                image={product.image}
                title={product.name}
            ></CardMedia>
            <CardContent>
                <Rating value={product.rating} readOnly></Rating>
                <Typography>{product.name}</Typography>
            </CardContent>
            </CardActionArea>
        </NextLink>
        <CardActions>
            <Typography>${product.price}</Typography>
            <Button
                size="small"
                color="primary"
                onClick={() => addToCartHandler(product)}
            >
                Add to cart
            </Button>
        </CardActions>
    </Card>
  )
}
