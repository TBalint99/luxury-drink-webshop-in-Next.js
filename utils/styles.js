import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    navbar: {
        backgroundColor: '#203040',
        '& a': {
            color: '#2A2A2A',
            marginLeft: 10,
        },
    },
    brand: {
        fontWeight: 'bold',
        fontSize: '1.5rem',
        color: '#fff'
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
        textAlign: 'center',
    },
})

export default useStyles;
