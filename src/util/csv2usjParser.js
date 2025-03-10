import Papa from 'papaparse'
import {generateBookName, parseLinePart1, parseLinePart2} from '../util/singleLineParser'


const csv2usj = (csvData,keepStrongNumbers) => {
  const ws = {
    keepStrongNumbers,
    curCh: 1
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
  generateBookName(topArr,parsedData[0])
  console.log(parsedData)
  parsedData?.data?.forEach(lineObj => 
    {
      // Strategy
      // - separate top level and level_1 based on any Par marker present in this line
      if ((lineObj?.Par) && (level1Arr.length>0)) {
        parseLinePart1(ws,topArr,lineObj)
        // First dump all current level_1 content into a paragraph (in the content field)
        topArr.push({
          type: "para",
          marker: "p",
          content: level1Arr
        })
        level1Arr = []    
        // Keep all content from now on in level1Arr
        parseLinePart2(ws,level1Arr,lineObj)
      } else {
        // Keep all content in level1Arr
        parseLinePart1(ws,level1Arr,lineObj)
        parseLinePart2(ws,level1Arr,lineObj)
      }
    }
  )
  usjObj.content = topArr
  return usjObj
}

export default csv2usj
