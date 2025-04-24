/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import Header from './Header'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import { USFMParser } from 'usfm-grammar-web'
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import JSZip from 'jszip'

const zip = new JSZip();

export default function AppLayout() {
  // eslint-disable-next-line no-unused-vars
  const [usfmText, setUsfmText] = useState()
  const [usjLoaded, setUsjLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [keepStrongNumbers, setKeepStrongNumbers] = useState(false)
  const [placeholders, setPlaceholders] = useState(false)
  const [brackets, setBrackets] = useState(false)
  
  const [result, setResult] = useState(null);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    const initParser = async () => {
      await USFMParser.init("https://cdn.jsdelivr.net/npm/usfm-grammar-web@3.0.0/tree-sitter-usfm.wasm",
                            "https://cdn.jsdelivr.net/npm/usfm-grammar-web@3.0.0/tree-sitter.wasm");

    };
    initParser();

    const handleCompleted = (resUsj,bookIdStr) => {
      zip.file(`${bookIdStr}.usj`, JSON.stringify(resUsj)); // adds the USJ data to the zip file
      const usfmParser2 = new USFMParser(null, resUsj) 
      const usfmStr = usfmParser2.usfm;
      const adaptedStr1 = usfmStr.replace(/ \\v (\d*)/g,"\n\\v $1")
      const adaptedStr2 = adaptedStr1.replace(/\\v (\d*)\s*\n/g,"\n\\v $1 ")
      const adaptedStr3 = adaptedStr2.replace(/\s*\n/g,"\n")
      const adaptedStr4 = adaptedStr3.replace(/\s\s/g," ")
      zip.file(`${bookIdStr}.usfm`, adaptedStr4); // adds the USFM data to the zip file  
    }

    const handleParseFinished = async () => {
      // csv2usj(keepStrongNumbers,placeholders,brackets,handleCompleted)
      const zipData = await zip.generateAsync({
        type: "blob",
        streamFiles: true
      })
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(zipData);
      link.download = `BSB.zip`
      link.click();
    }
  
    // Create a new web worker
    const myWorker = new Worker('src/components/worker.js');

    // Set up event listener for messages from the worker
    myWorker.onmessage = function (event) {
      const bookIdStr = event?.data?.bookIdStr
      const usjObj = event?.data?.usjObj
      console.log('Received result from worker:', bookIdStr);
      setResult(bookIdStr);
      handleCompleted(usjObj,bookIdStr)
      if (event?.data?.parserFinished) {
        setLoading(false)
        handleParseFinished()
      }
    };

    // Save the worker instance to state
    setWorker(myWorker);

    // Clean up the worker when the component unmounts
    return () => {
      myWorker.terminate();
    };
  }, []); // Run this effect only once when the component mounts
 

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
  const handleClick = () => {
    setLoading(true)
    if (worker) {
      const paramObj = {
        keepStrongNumbers,
        placeholders,
        brackets,
      }
      worker.postMessage(paramObj) // Send the number 5 to the worker
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ position: 'fixed', top: 0, left: 0, right: 0 }} elevation={3}>
        {!usjLoaded && !loading && 
          (<Header 
            title={"Csv2Usfm Converter"}
            keepStrongNumbers={keepStrongNumbers}
            placeholders={placeholders}
            brackets={brackets}
            onStrongNumbersChanged={()=>setKeepStrongNumbers(prev => (!prev))}
            onPlaceholdersChanged={()=>setPlaceholders(prev => (!prev))}
            onBracketsChanged={()=>setBrackets(prev => (!prev))}
            // onOpenClick={handleOpen}
            onOpenClick={handleClick}
          />)}
      </Paper>
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
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            paddingTop: '250px' 
          }}>
        <Typography id="result-from-worker" variant="h6" component="h2">
        Result from the worker: {result}
        </Typography>
      </Box>
    </Box>
  )
}
