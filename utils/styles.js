import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    navbar: {
        backgroundColor: '#203040',
        '& a': {
            marginLeft: 10,
        },
    },
    toolbar: {
        justifyContent: 'space-between'
    },
    brand: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
    },
    grow: {
        flexGrow: 1,
    },
    link: {
        color: '#fff',
    },
    backicon: {
        marginRight: '.15em',
        marginBottom: '.06em'
    },
    main: {
        minHeight: '80vh',
    },
    footer: {
        marginTop: 10,
        textAlign: 'center',
    },
    section: {
        marginTop: 10,
        marginBottom: 10
    },
    linkContainer: {
        display: 'flex',
        paddingRight: '1em',
        gap: '1.5em'
    },
    form: {
        width: '100%',
        maxWidth: 800,
        margin: '0 auto'
    },
    navbarButton: {
        textTransform: 'initial'
    },
    transparentBackground: {
        backgroundColor: 'transparent'
    },
    error: {
        color: '#f04040'
    },
    fullWidth: {
        width: '100%'
    },
    reviewForm: {
        maxWidth: 800,
        width: '100%'
    },
    date: {
        fontSize: '.9rem',
        opacity: '.65'
    },
    reviewItem: {
        paddingLeft: '0'
    },
    mt1: {
        marginTop: '1rem'
    },
    searchSection: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex'
        }
    },
    searchForm: {
        border: '1px solid #AEFEFF',
        backgroundColor: '#ffffff',
        borderRadius: 5
    },
    searchInput: {
        paddingLeft: 5,
        color: '#000000',
        '& ::placeholder': {
            color: '#606060'
        }
    },
    iconButton: {
        backgroundColor: '#AEFEFF',
        padding: 5,
        borderRadius: '0 5px 5px 0',
        '& span': {
            color: '#000000'
        }
    },
    sort: {
        marginRight: 5
    },
    featuredImage: {
        height: '380px',
        width: '100%',
        objectFit: 'cover',
        objectPosition: 'center'
    }
}))

export default useStyles;
