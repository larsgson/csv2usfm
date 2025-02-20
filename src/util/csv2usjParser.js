import Papa from 'papaparse'
import {generateBookName, parseLine} from '../util/singleLineParser'

const parseCsv = (csvData) => {
  const ws = {
    curCh: 1
  }
  const usjObj = {
    type: "USJ",
    version: "3.1",
    content: []
  }
  const parsedData = Papa.parse(csvData, {
    header: true,
    // eslint-disable-next-line no-unused-vars
    transformHeader: (str,_inx) => str.replace(/\s+/g, ''),
    dynamicTyping: true,
  })
  generateBookName(usjObj,parsedData[0])
  console.log(parsedData)
  parsedData?.data?.forEach(lineObj => parseLine(ws,usjObj,lineObj))
  return usjObj
}

function csv2usj(csvData) {
  return parseCsv(csvData)
}

export default csv2usj
