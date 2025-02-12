/* eslint-disable react/prop-types */
import 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Fab from '@mui/material/Fab'
import SourceIcon from '@mui/icons-material/Source'

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

