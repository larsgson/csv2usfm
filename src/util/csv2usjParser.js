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

const parseBookId = "TIT"

const csv2usj = (csvData,keepStrongNumbers) => {
  const ws = {
    keepStrongNumbers,
  }
  const usjObj = {
    type: "USJ",
    version: "3.1",
  }
  const topArr = []
  let level1Arr = []

  const parsedData = Papa.parse(csvData, {
    header: true,
    // eslint-disable-next-line no-unused-vars
    transformHeader: (str,_inx) => str.replace(/\s+/g, ''),
    dynamicTyping: true,
  })
    
  parsedData?.data?.forEach(lineObj => {
    const bcvObj = getBcvObj(lineObj)
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
            content: level1Arr
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
  })

  if (level1Arr.length>0) {
    // Now dump all current level_1 content into a paragraph (in the content field)
    topArr.push({
      type: "para",
      marker: "p",
      content: level1Arr
    })
  }
  usjObj.content = topArr
  return usjObj
}

export default csv2usj
