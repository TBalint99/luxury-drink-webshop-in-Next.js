import bcrypt from 'bcryptjs'

const data = {
    users: [
        {
            name: 'Balint',
            email: 'tbalint99@gmail.com',
            password: bcrypt.hashSync('password'),
            isAdmin: true
        },
        {
            name: 'Dorka',
            email: 'szekdorottya@gmail.com',
            password: bcrypt.hashSync('password'),
            isAdmin: false

        },
    ],
    products: [
        {
            name: 'The Glenlivet',
            slug: 'the-glenlivet',
            category: 'Whisky',
            image: '/images/drink-1.jpg',
            isFeatured: true,
            featuredImage: '/images/banner1.jpg',
            price: 70,
            brand: 'The Glenlivet',
            rating: 4.5,
            numReviews: 10,
            countInStock: 20,
            description: 'Balanced, rich and elegant, this is a whisky for special occasions',
        },
        {
            name: 'Woodford Reserve',
            slug: 'woodford-reserve',
            category: 'Whisky',
            image: '/images/drink-2.jpg',
            isFeatured: true,
            featuredImage: '/images/banner2.jpg',
            price: 80,
            brand: 'Woodford Reserve',
            rating: 4.2,
            numReviews: 10,
            countInStock: 20,
            description: 'The whiskey is also unusual for being triple distilled and having the lowest proof upon entering the barrel where it matures for at least six years. A must have Kentucky bourbon.',
        },
        {
            name: 'Colonel EH Taylor Small Batch',
            slug: 'colonel-eh-taylor-small-batch',
            category: 'Whisky',
            image: '/images/drink-3.jpg',
            price: 90,
            brand: 'Colonel',
            rating: 4.5,
            numReviews: 10,
            countInStock: 20,
            description: "This small batch bourbon is named after Colonel Edmund Haynes Taylor, an incredibly important figure in bourbon's history from the 1800s who owned a whole host of distilleries and innovated production methods which are still used today.",
        },
        {
            name: 'Talisker 10 Year',
            slug: 'talisker-10-years',
            category: 'Whisky',
            image: '/images/drink-4.jpg',
            price: 90,
            brand: 'Talisker',
            rating: 4.5,
            numReviews: 10,
            countInStock: 20,
            description: 'United by an unmistakeable sweet peppery smoke, all Talisker malts bring character in abundance.',
        },
        {
            name: 'Bacardi 151',
            slug: 'bacardi-151',
            category: 'Rum',
            image: '/images/drink-5.jpg',
            price: 95,
            brand: 'Bacardi',
            rating: 4.5,
            numReviews: 10,
            countInStock: 20,
            description: 'Bacardi 151 rum is one of the most well known overproof rums on the market. 151 tends to be the most common overproof strength because in pot stills this is the natural dillilation proof, but overproof rums in generally can range from 100-170+.',
        },
        {
            name: 'Johnnie Walker Black Label',
            slug: 'johnnie-walker-black-label',
            category: 'Whisky',
            image: '/images/drink-6.jpg',
            price: 75,
            brand: 'Johnnie Walker',
            rating: 4.5,
            numReviews: 10,
            countInStock: 20,
            description: 'Johnnie Walker Black Label | Scotch Whisky | Johnnie Walker. masterful blend of single malt and grain whiskies from across Scotland, aged for at least 12 years.',
        },
    ],
  }

  export default data