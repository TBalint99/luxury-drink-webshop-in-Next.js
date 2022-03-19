import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    navbar: {
        backgroundColor: '#203040',
        '& a': {
            marginLeft: 10,
        },
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
    }
})

export default useStyles;