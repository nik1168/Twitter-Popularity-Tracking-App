import React, {Component} from 'react';
import './App.css';
import {ThemeProvider} from '@material-ui/styles';
import {createMuiTheme} from '@material-ui/core/styles'
import {blue, indigo} from '@material-ui/core/colors'
import Routes from './routes'

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: blue[900]
    },
    primary: {
      main: indigo[700]
    }
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '"Lato"',
      'sans-serif'
    ].join(',')
  }
});
class App extends Component {
  render() {
    return (
        <div>
          <ThemeProvider theme={theme}>
            <Routes />
          </ThemeProvider>
        </div>
    );
  }
}

export default App;
