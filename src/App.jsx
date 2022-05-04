import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { useState, useCallback, useEffect } from 'react'

const buttonsList = [
  "7", "8", "9", "del",
  "4", "5", "6", "+",
  "1", "2", "3", "-",
  '.', "0", "/", "x",
  'reset', '='
]
const buttonsListShortcuts = [
  "7", "8", "9", "Backspace",
  "4", "5", "6", "+",
  "1", "2", "3", "-",
  '.', "0", "/", "*",
  'Escape', '= , Enter'
]
const buttonsListSmallerFont = ["del", 'reset', '=']
const buttonsListColorSecondary = ["del", 'reset']
const buttonsListColorTertiary = ['=']
const getButtonColor = (buttonText) => {
  if (buttonsListColorSecondary.includes(buttonText)) {
    return 'text.secondary'
  }
  if (buttonsListColorTertiary.includes(buttonText)) {
    return 'text.equalSign'
  }
  return 'text.primary'
}
const getButtonBackgroundColor = (buttonText) => {
  if (buttonsListColorSecondary.includes(buttonText)) {
    return 'background.keys.secondary'
  }
  if (buttonsListColorTertiary.includes(buttonText)) {
    return 'background.keys.tertiary'
  }
  return 'background.keys.main'
}
const getButtonShadow = (buttonText) => {
  if (buttonsListColorSecondary.includes(buttonText)) {
    return 'background.keys.secondaryShasow'
  }
  if (buttonsListColorTertiary.includes(buttonText)) {
    return 'background.keys.tertiaryShasow'
  }
  return 'background.keys.mainShadow'
}

const marks = [
  {
    value: 1,
    label: '1',
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },

];

const br = 1.5;
const smGridSpacing = 2.5;
const xsGridSpacing = 1.5;
const sliderRadius = 14;

const ThemeSlider = styled(Slider)(({ theme }) => ({
  width: '35px',
  marginRight: sliderRadius / 2 + 'px !important',
  alignSelf: 'center',
  transform: 'translateY(7%)',
  '& .MuiSlider-rail': {
    height: sliderRadius + 'px',
    backgroundColor: theme.palette.background.surface.light,
    border: '3px solid ' + theme.palette.background.surface.light,
    width: '49px',
    transform: 'translate(-10px, -50%)',
  },
  '& .MuiSlider-mark': {
    display: 'none',
  },
  '& .MuiSlider-markLabel': {
    top: '-13px',
    color: theme.palette.text.info,
    fontSize: '0.8rem',
  },
  '& .MuiSlider-thumb': {
    width: sliderRadius + 'px',
    height: sliderRadius + 'px',
    color: theme.palette.background.keys.tertiary,
  },
  '& .MuiSlider-thumb:hover': {
    boxShadow: 'none',
  },
  '& .Mui-focusVisible': {
    boxShadow: 'none',
  },
}));

String.prototype.toNumber = function () {
  return parseFloat(this.valueOf().replace(",", "."));
}

function calculate(a, operator, b) {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
    case 'x':
      return a * b;
    case '/':
      return a / b;
  }
}

function App({ themeNumber, switchTheme }) {
  const [input, setInput] = useState("0");
  const [inputHistory, setInputHistory] = useState("");
  const [isInputStale, setIsInputStale] = useState(false);
  const [result, setResult] = useState(0);

  const handleClick = useCallback((buttonText) => {
    const operatorRegex = /\+|\-|\x|\//g
    switch (buttonText) {
      case "del":
        !isInputStale && setInput(oldInput => oldInput.length === 1 ? "0" : oldInput.slice(0, -1));
        break;
      case "reset":
        setInputHistory("");
        setInput("0");
        setResult(0);
        setIsInputStale(false);
        break;
      case "=":
        if (!isInputStale) {
          setInput(`${calculate(result, inputHistory.match(operatorRegex).at(-1), input.toNumber())}`.replace(".", ","))
        }
        setResult(0);
        setInputHistory("");
        setIsInputStale(true);
        break;
      case ".":
        if (isInputStale) {
          setInput("0,");
          setIsInputStale(false);
        } else {
          setInput(oldInput => (
            oldInput.includes(",") ? oldInput : oldInput === "" ? oldInput += "0," : oldInput += ","
          ));
        }
        break;
      case "+":
      case "-":
      case "x":
      case "/":
        if (isInputStale && inputHistory === "") { // take ans plus operator
          setInputHistory(`${input.replace(".", ",")} ${buttonText} `);
          setResult(input.toNumber());
        } else if (isInputStale) { // changing operator
          // to enter negative numbers
          const isEnteringNegativeNumber = buttonText === "-" && (inputHistory.at(-2) === "x" || inputHistory.at(-2) === "/") && isInputStale
          if (isEnteringNegativeNumber) {
            setInput("-");
            setIsInputStale(false)
          } else {
            setInputHistory(oldInput => `${oldInput.slice(0, -3)} ${buttonText} `);
          }
        } else { // adding new operator & calculate
          setInputHistory(oldInput => {
            setResult(oldResult => {
              const oldOperator = inputHistory.match(operatorRegex) ? inputHistory.match(operatorRegex).at(-1) : '+';
              const newResult = calculate(result, oldOperator, input.toNumber())
              setInput(`${newResult}`.replace(".", ","));
              return newResult;
            })
            return `${inputHistory}${input} ${buttonText} `;
          });
          setIsInputStale(true);
        }
        break;
      case "0":
        if (isInputStale) {
          setInput(buttonText)
          setIsInputStale(false);
        } else {
          setInput(oldInput => oldInput === "0" ? "0" : `${oldInput}${buttonText}`);
        }
        break;
      default:
        if (isInputStale) {
          setInput(buttonText)
          setIsInputStale(false);
        } else {
          setInput(oldInput => oldInput === "0" ? `${buttonText}` : `${oldInput}${buttonText}`);
        }
    }
  }, [input, isInputStale, inputHistory, result]);

  const handleKeyDown = useCallback((event) => {
    // console.log(event.key);
    if (buttonsList.includes(event.key)) {
      handleClick(event.key);
    }
    if (event.key === "Escape") {
      handleClick("reset");
    }
    if (event.key === "Backspace") {
      handleClick("del");
    }
    if (event.key === "*") {
      handleClick("x");
    }
    if (event.key === "Enter") {
      handleClick("=");
    }
  }, [input, isInputStale, inputHistory, result])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  })

  return (
    <Stack width='100vw'
      minHeight='100vh'
      justifyContent='center'
      sx={{ backgroundColor: 'background.surface.main', alignItems: 'center' }}
    >
      <Stack
        maxWidth='400px'
        spacing={2}
        m={2}
      >
        <Stack direction='row' spacing={3.5}
          sx={{ alignItems: 'baseline' }}
        >
          <Typography component='h1'
            flexGrow={1}
            sx={{
              color: 'text.info',
              fontSize: '2rem'
            }}
          >
            calc
          </Typography>
          <Typography id="theme-slider"
            letterSpacing={1.2}
            sx={{
              color: 'text.info',
              fontSize: '0.7rem'
            }}
          >
            THEME
          </Typography>
          <ThemeSlider
            aria-labelledby="theme-slider"
            value={themeNumber}
            step={1} max={3} min={1}
            marks={marks}
            track={false}
            onChangeCommitted={(event, value) => switchTheme(value)}
          />
        </Stack>
        <Stack
          justifyContent='space-around'
          sx={{
            height: '90.5px',
            backgroundColor: 'background.surface.dark',
            borderRadius: br,
          }}
        >
          {
            inputHistory && (
              <TextField value={inputHistory} readOnly
                fullWidth
                inputProps={{ style: { textAlign: 'right' } }}
                sx={{
                  input: {
                    paddingTop: 1.5, paddingBottom: 0,
                    color: 'text.info',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    caretColor: 'transparent',
                  },
                  '& fieldset': { border: 'none' },
                }}
              />
            )
          }
          <TextField value={input} readOnly
            fullWidth
            autoFocus
            inputProps={{ style: { textAlign: 'right' } }}
            sx={{
              input: {
                paddingTop: inputHistory ? 0 : 'auto',
                paddingBottom: inputHistory ? 1 : 'auto',
                color: 'text.info',
                fontSize: inputHistory ? '2.2rem' : '2.5rem',
                fontWeight: 'bold',
                caretColor: 'transparent',
              },
              '& fieldset': { border: 'none' },
            }}
          />
        </Stack>
        <Box
          bgcolor='background.surface.light'
          borderRadius={br}
          p={smGridSpacing}
        >
          <Grid container spacing={{ xs: xsGridSpacing, sm: smGridSpacing }}
            columns={4}
          >
            {
              buttonsList.map((buttonText, index) =>
                <Grid key={buttonText} item xs={index < buttonsList.length - 2 ? 1 : 2} >
                  <Button variant='contained'
                    fullWidth
                    disableElevation
                    disableRipple
                    title={buttonsListShortcuts[index]}
                    sx={{
                      height: '47.5px',
                      minWidth: '30px',
                      pt: 0,
                      pb: 0,
                      borderRadius: br,
                      lineHeight: '1.65',
                      textTransform: buttonText === "x" ? 'lowercase' : 'uppercase',
                      fontSize: buttonsListSmallerFont.includes(buttonText) ? '1.2rem' : '1.8rem',
                      fontWeight: buttonsListSmallerFont.includes(buttonText) ? '500' : 'bold',
                      color: getButtonColor(buttonText),
                      backgroundColor: getButtonBackgroundColor(buttonText),
                      position: 'relative',
                      overflow: 'hidden',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: '9px',
                        backgroundColor: getButtonShadow(buttonText),
                      },
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 3,
                        width: '100%',
                        height: '9px',
                        backgroundColor: 'inherit',
                        borderRadius: br,
                      },
                      '&:hover:after': {
                        backgroundColor: 'inherit'
                      },
                      '&:hover': {
                        backgroundColor: getButtonShadow(buttonText),
                      }
                    }}
                    onClick={() => handleClick(buttonText)}
                  >
                    {buttonText}
                  </Button>
                </Grid>
              )
            }
          </Grid>
        </Box>
      </Stack >
    </Stack>
  )
}

export default App
