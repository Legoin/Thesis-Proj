import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Constants from '../constants/Queries';
import { Redirect } from 'react-router-dom';
import swal from 'sweetalert';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://material-ui.com/'>
        X Town
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  const [state, setState] = useState({
    email: '',
    password: '',
    RoleID: 0,
  });
  const handelChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const Login = Constants.login(state.email, state.password);
    Constants.request(Login)
      .then((response) => {
        console.log(response.data.data.login);
        if (response.data.data.login) {
          localStorage.removeItem('xTown');
          localStorage.setItem('xTown', response.data.data.login.token);
          const n = response.data.data.login.RoleID;
          setState({
            RoleID: n,
          });
        } else {
          throw new Error('The email or password are not correct');
        }
      })
      .catch((err) => {
        swal('OoOps!', err.message, 'error');
      });
    // if (n == 1) {
    //   // props.history.push("/admin")
    // } else if (n == 2) {
    //   props.history.push('/dashboard');
    // } else if (n == 3) {
    //   props.history.push('/');
    // }
  };

  const classes = useStyles();

  if (state.RoleID == 1) {
    return (
      <Redirect
        to={{
          pathname: `/provider`,
        }}
      />
    );
  } else if (state.RoleID == 2) {
    return (
      <Redirect
        to={{
          pathname: `/dashboard`,
        }}
      />
    );
  } else if (state.RoleID == 3) {
    return (
      <Redirect
        to={{
          pathname: `/`,
        }}
      />
    );
  } else {
    return (
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              id='email'
              value={state.email}
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              onChange={handelChange}
            />
            <TextField
              variant='outlined'
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              value={state.password}
              type='password'
              id='password'
              onChange={handelChange}
              autoComplete='current-password'
            />
            {/* <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
              label='Remember me'
            /> */}
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              className={classes.submit}
              onClick={handleSubmit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href='#' variant='body2'>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href='/signUp' variant='body2'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
