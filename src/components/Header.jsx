/* eslint-disable react/prop-types */
import 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Fab from '@mui/material/Fab'
import SourceIcon from '@mui/icons-material/Source'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const sx = {
  title: {
    flexGrow: 1,
    color: '#ffffff',
  },
  extendedIcon: {
    marginRight: theme => theme.spacing(1),
  },
}

export default function Header({
  title,
  onOpenClick,
  keepStrongNumbers,
  keepPlaceholdersNBrackets,
  onStrongNumbersChanged,
  onPlaceholdersNBracketsChanged
}) 
{
  return (
    <AppBar position='fixed'>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <div className='flex flex-1 justify-center items-center'>
          <Typography
            variant='h4'
            sx={{
              fontWeight: 'bold',
              m: 1,
              flexGrow: 1,
              color: '#ffffff',            
            }}
          >
            {title}
          </Typography>
          <FormGroup>
          <FormControlLabel 
              control={
                <Checkbox
                checked={keepStrongNumbers}
                onChange={onStrongNumbersChanged}
                inputProps={{ 'aria-label': 'strongs numbers' }}
              />
              }
              label="Include Strongs Numbers" 
            />
            <FormControlLabel 
              control={
                <Checkbox
                checked={keepPlaceholdersNBrackets}
                onChange={onPlaceholdersNBracketsChanged}
                inputProps={{ 'aria-label': 'strongs numbers' }}
              />
              }
              label="Include Placeholders and Brackets" 
            />
          </FormGroup>
        </div>
        <>
          <Fab
            color='primary'
            aria-label='view'
            variant='extended'
            onClick={onOpenClick}
          >
            <SourceIcon sx={sx.extendedIcon} />
            Open file
          </Fab>
        </>
      </Toolbar>
    </AppBar>
  )
}

