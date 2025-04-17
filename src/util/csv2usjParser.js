/* eslint-disable no-unused-vars */
import Papa from 'papaparse'
import {generateBookName, parseLinePart1, parseLinePart2} from '../util/singleLineParser'
import {name2id3} from '../data/name2id3'

const getBcvObj = (lineObj) => {
  let resObj = {}
  const regexp = /(.*)\s(\d*):(\d*)/g
  const checkVerse = lineObj?.VerseId
  if (checkVerse) {
    const resArr = [...checkVerse.matchAll(regexp)]
    if (resArr) {
      const matchObj = resArr[0]
      if (matchObj && matchObj.length>3) {
        const bookName = matchObj[1]
        resObj = {
          bookName,
          ptxId: name2id3[bookName.replace(/\s+/g, '')],
          ch: parseInt(matchObj[2]),
          v: parseInt(matchObj[3])
        }
      }
    }
  }
  return resObj
}

// const parseBookId = "TIT"
const parseBookId = "RUT"

const joinIfStr = (arr) => {
  const retObj = arr.reduce(
    (acc, val) => {
      if (typeof val === "string") {
        acc.tempStr += val // join to tempStr
      } else {
        if (acc.tempStr?.length>0) {
          acc.retArr.push(acc.tempStr) // push tempStr
          acc.tempStr = "" // reset tempStr  
        }
        acc.retArr.push(val)
      }
      return acc
    },
    { 
      tempStr: "",
      retArr: []
    }      
  )
  if (retObj.tempStr?.length>0) retObj.retArr.push(retObj.tempStr)
  return retObj.retArr    
}

const csv2usj = (csvData,keepStrongNumbers,placeholdersNBrackets,onCompleted) => {
  const ws = {
    keepStrongNumbers,
    placeholdersNBrackets
  }
  const usjObj = {
    type: "USJ",
    version: "3.1",
  }
  const topArr = []
  let level1Arr = []
  let curBook = ""

  // ToDo: Check possibly streaming for big size CSV:
  // https://www.papaparse.com/faq#streaming
  // https://deadsimplechat.com/blog/csv-files-with-nodejs-papaparse/
  Papa.parse(csvData, {
    header: true,
    // eslint-disable-next-line no-unused-vars
    transformHeader: (str,_inx) => str.replace(/\s+/g, ''),
    step: function(result) {
      const lineObj = result?.data
      // Process each row of the csv as it is parsed
      const bcvObj = getBcvObj(lineObj)
      if ((bcvObj?.ch === 1) && (bcvObj?.v === 1)) {
        console.log(bcvObj?.ptxId)
      }
      if (result?.data?.VerseId) {
        if (curBook !== bcvObj.bookName) {
          curBook = bcvObj.bookName
          console.log(curBook)
        }
      }
      if ((bcvObj?.ptxId === parseBookId) && (bcvObj?.ch === 1) && (bcvObj?.v === 1)) {
        ws.curPtxId = bcvObj.ptxId
        ws.curBookName = bcvObj.bookName
        generateBookName(topArr,bcvObj)
      }
      if (ws?.curPtxId === parseBookId) {
        // Strategy
        // - separate top level and level_1 based on any Par marker present in this line
        const curCh = bcvObj?.ch
        const newCh = ((curCh) && (ws.curCh !== bcvObj.ch)) 
        if ((lineObj?.Par) && ((newCh) || (level1Arr.length>0))) {
          if (level1Arr.length>0) {
            // Now dump all current level_1 content into a paragraph (in the content field)
            topArr.push({
              type: "para",
              marker: "p",
              content: joinIfStr(level1Arr)
            })
            level1Arr = []    
          }
          parseLinePart1(ws,topArr,lineObj,bcvObj)
          // Keep all content from now on in level1Arr
          parseLinePart2(ws,level1Arr,lineObj,bcvObj)
        } else {
          // Keep all content in level1Arr
          parseLinePart1(ws,level1Arr,lineObj,bcvObj)
          parseLinePart2(ws,level1Arr,lineObj,bcvObj)
        }
      }
    },
    complete: function() {
      console.log("Data Parsing complete.");
      if (level1Arr.length>0) {
        // Now dump all current level_1 content into a paragraph (in the content field)
        topArr.push({
          type: "para",
          marker: "p",
          content: joinIfStr(level1Arr)
        })
      }
      usjObj.content = topArr
      console.log(usjObj)
      onCompleted && onCompleted(usjObj)
    },
    // dynamicTyping: true,
  })


  // Papa.parse(csvData, {
  //   header: true,
  //   step: function(result) {
  //     // Process each row of the csv as it is parsed
  //     console.log(result?.data?.VerseId);
  //   },
  //   complete: function() {
  //     console.log("Data Parsing complete.");
  //   }
  // });


// import {csv} from 'csv-parser'
// import {fs} from 'fs'
  
// const results = [];

  // parsedData?.data?.forEach(lineObj => {

  // return usjObj
}

export default csv2usj
