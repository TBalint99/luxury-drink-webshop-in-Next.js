import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
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
    }
})

export default useStyles;
