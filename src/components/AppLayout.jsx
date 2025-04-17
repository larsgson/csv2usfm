/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
// import { fileOpen } from 'browser-fs-access'
import Header from './Header'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { USFMParser } from 'usfm-grammar-web'
import SimpleEditor from './SimpleEditor'
import TextField from "@mui/material/TextField"

//import {csvData} from '../data/bsb_tables_csv'
import {csvData} from '../data/ruth-csv'
// import html2usfm from '../util/html2usfmParser'
import csv2usj from '../util/csv2usjParser'

import Modal from '@mui/material/Modal'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export default function AppLayout() {
  // eslint-disable-next-line no-unused-vars
  const [usfmText, setUsfmText] = useState()
  const [usjText, setUsjText] = useState()
  const [usjLoaded, setUsjLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [keepStrongNumbers, setKeepStrongNumbers] = useState(false)
  const [placeholdersNBrackets, setPlaceholdersNBrackets] = useState(false)
  

  useEffect(() => {
    const initParser = async () => {
      await USFMParser.init("https://cdn.jsdelivr.net/npm/usfm-grammar-web@3.0.0/tree-sitter-usfm.wasm",
                            "https://cdn.jsdelivr.net/npm/usfm-grammar-web@3.0.0/tree-sitter.wasm");

    };
    initParser();
  }, []);

  const handleClose = () => setModalOpen(false)
  
  const handleCompleted = (resUsj) => {
    setUsjLoaded(true)
    setUsjText(JSON.stringify(resUsj))
    const usfmParser2 = new USFMParser(null, resUsj) 
    const usfmStr = usfmParser2.usfm;
    const adaptedStr1 = usfmStr.replace(/ \\v (\d*)/g,"\n\\v $1")
    const adaptedStr2 = adaptedStr1.replace(/\\v (\d*)\s*\n/g,"\n\\v $1 ")
    const adaptedStr3 = adaptedStr2.replace(/\s*\n/g,"\n")
    const adaptedStr4 = adaptedStr3.replace(/\s\s/g," ")
    setUsfmText(adaptedStr4)
    setLoading(false)
    setModalOpen(true)
  }
  
  const handleOpen = async () => {
    setLoading(true)
    csv2usj(csvData,keepStrongNumbers,placeholdersNBrackets,handleCompleted)

    // const file = await fileOpen([
    //   {
    //     description: 'USFM - text files',
    //     mimeTypes: ['text/*'],
    //     extensions: ['.usfm'],
    //   }
    // ])
    // const filePath = file?.name
    // if (filePath !== null) {
    //   const extStr = filePath?.substring(filePath?.lastIndexOf("."))
    //   if (extStr === ".usfm") {
    //     const contents = await await file.text()
    //     setUsfmText(contents)
    //     setHtmlFileLoaded(true)
    //     setLoading(false)
    //   } else {
    //     console.log("invalid file extension")
    //   }
    // } else {
    //   console.log("invalid file")
    // }
    // setHtmlText(htmlText)
    // const tempUsfm = JSON.stringify(html2usfm(htmlText))
    // const tmpText = html2usfm(htmlText)
  }

  const editorProps = {
    docSetId: 'abc-xyz',
    usfmText,
    defaultOptions:{
      editable: false,
      sectionable: false,
      blockable: false,
      preview: true,
    }
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ position: 'fixed', top: 0, left: 0, right: 0 }} elevation={3}>
        {!usjLoaded && !loading && 
          (<Header 
            title={"Csv2Usfm Converter"}
            keepStrongNumbers={keepStrongNumbers}
            placeholdersNBrackets={placeholdersNBrackets}
            onStrongNumbersChanged={()=>setKeepStrongNumbers(prev => (!prev))}
            onPlaceholdersNBracketsChanged={()=>setPlaceholdersNBrackets(prev => (!prev))}
            onOpenClick={handleOpen}
          />)}
      </Paper>
      {/* <div>
        <Modal
          open={modalOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              USJ ouput (only during the testing phase)
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <span>{usjText}</span>
          </Typography>
          </Box>
        </Modal>
      </div> */}
      {usjLoaded && (
        <>
          <TextField
            label="Readonly"
            variant="outlined"
            multiline
            defaultValue={usfmText}
            inputProps={{ readOnly: true }}
            sx={{
              width: "100%",
              marginTop: 3,
            }}
          />
          <SimpleEditor {...editorProps } />
        </>
      )}
      {loading && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            paddingTop: '150px' 
          }}>
          <CircularProgress disableShrink/>
        </Box>
      )}
    </Box>

  )
}
