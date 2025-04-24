/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-undef
importScripts("papaparse.min.js")

const name2id3 = {
  "Genesis": "GEN",
  "Exodus": "EXO",
  "Leviticus": "LEV",
  "Numbers": "NUM",
  "Deuteronomy": "DEU",
  "Joshua": "JOS",
  "Judges": "JDG",
  "Ruth": "RUT",
  "1Samuel": "1SA",
  "2Samuel": "2SA",
  "1Kings": "1KI",
  "2Kings": "2KI",
  "1Chronicles": "1CH",
  "2Chronicles": "2CH",
  "Ezra": "EZR",
  "Nehemiah": "NEH",
  "Esther": "EST",
  "Job": "JOB",
  "Psalms": "PSA",
  "Proverbs": "PRO",
  "Ecclesiastes": "ECC",
  "SongofSolomon": "SNG",
  "Isaiah": "ISA",
  "Jeremiah": "JER",
  "Lamentations": "LAM",
  "Ezekiel": "EZK",
  "Daniel": "DAN",
  "Hosea": "HOS",
  "Joel": "JOL",
  "Amos": "AMO",
  "Obadiah": "OBA",
  "Jonah": "JON",
  "Micah": "MIC",
  "Nahum": "NAM",
  "Habakkuk": "HAB",
  "Zephaniah": "ZEP",
  "Haggai": "HAG",
  "Zechariah": "ZEC",
  "Malachi": "MAL",
  "Matthew": "MAT",
  "Mark": "MRK",
  "Luke": "LUK",
  "John": "JHN",
  "Acts": "ACT",
  "Romans": "ROM",
  "1Corinthians": "1CO",
  "2Corinthians": "2CO",
  "Galatians": "GAL",
  "Ephesians": "EPH",
  "Philippians": "PHP",
  "Colossians": "COL",
  "1Thessalonians": "1TH",
  "2Thessalonians": "2TH",
  "1Timothy": "1TI",
  "2Timothy": "2TI",
  "Titus": "TIT",
  "Philemon": "PHM",
  "Hebrews": "HEB",
  "James": "JAS",
  "1Peter": "1PE",
  "2Peter": "2PE",
  "1John": "1JN",
  "2John": "2JN",
  "3John": "3JN",
  "Jude": "JUD",
  "Revelation": "REV"
}

// function strip(html){
//   let doc = new DOMParser().parseFromString(html, 'text/html')
//   return doc.body.textContent || ""
// }

function strip(str){
  return str.trim()
}

const generateBookName = (content,bcvObj) => {
  content.push({
    type: "book",
    marker: "id",
    code: bcvObj?.ptxId,
    content: ["- Berean Study Bible"]
  })
  // content.push({
  //   type: "para", 
  //   marker: "ide", 
  //   content: ["UTF-8"]
  // })
  content.push({
    type: "para", 
    marker: "h", 
    content: [`${bcvObj?.bookName}`]
  })
  content.push({
    type: "para", 
    marker: "toc1", 
    content: [`${bcvObj?.bookName}`]
  })
  content.push({
    type: "para", 
    marker: "toc2", 
    content: [`${bcvObj?.bookName}`]
  })
  content.push({
    type: "para", 
    marker: "toc3",
    content: [`${bcvObj?.bookName}`]
  })
  content.push({
    type: "para", 
    marker: "mt1", 
    content: [`${bcvObj?.bookName}`]
  })  
}

const parseLinePart1 = (ws,content,lineItem,bcvObj) => {
  const curCh = bcvObj?.ch
  if ((curCh) && (ws.curCh !== bcvObj.ch)) {
    ws.curCh = bcvObj.ch
    content.push({
      type: "chapter",
      marker: "c",
      number: bcvObj.ch.toString(),
      // sid: `${bcvObj.ptxId} ${bcvObj.ch}`
    })
  }
  if (lineItem?.Hdg) {
    content.push({
      type: "para",
      marker: "s1",
      content: [ `${strip(lineItem.Hdg)}` ]
    })
  }
  if (lineItem?.Crossref) {
    content.push({
      type: "para",
      marker: "r",
      content: [ `${strip(lineItem.Crossref)}` ]
    })
  }
}

const parseLinePart2 = (ws,content,lineItem,bcvObj) => {
  const curV = bcvObj?.v
  if ((curV) && (ws.curV !== bcvObj.v)) {
    ws.curV = bcvObj.v
    content.push({
      type: "verse",
      marker: "v",
      number: bcvObj.v.toString(),
      // sid: `${bcvObj.ptxId} ${bcvObj.ch}:${bcvObj.v}`
    })
  }
  if (lineItem?.space) content.push(lineItem?.space)
  if (lineItem?.begQ) content.push(lineItem?.begQ)  
  if (lineItem?.BSBversion) {
    let curStr = lineItem.BSBversion?.trim()
    if (!ws.brackets) {
      if (lineItem.BSBversion === " - ") {
        curStr = ""
      }
      const tempStr1 = curStr
      curStr = tempStr1.replace(/\. \. \./g,"")
    }
    if (lineItem?.pnc) {
      curStr+=lineItem?.pnc+' '
    } else {
      curStr+=' '
    }
    if (!ws.brackets) {
      const tempStr1 = curStr.replace(/vvv/g,"")
      const tempStr2 = tempStr1.replace(/\[|\]|{|}/g,"")
      curStr=tempStr2
    }
    if (ws.keepStrongNumbers) {
      content.push({
        type: "char",
        marker: "w",
        content: [ `${curStr}` ],
        strong: lineItem?.StrGrk
      })
    } else {
      content.push(curStr)
    }
  }
  if (lineItem?.endQ) content.push(lineItem.endQ)
  if (lineItem?.footnotes) {
    content.push({
      "type": "note",
      "marker": "f",
      "content": [
        {
          "type": "char",
          "marker": "fr",
          "content": [ `${ws.curCh}:${ws.curV} ` ]
        },
        {
          "type": "char",
          "marker": "ft",
          "content": [ `${lineItem.footnotes}` ]
        }
      ],
      "caller": "+"

    })
  }
}

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

const csv2usj = (csvData,keepStrongNumbers,placeholders,brackets) => {
  const ws = {
    keepStrongNumbers,
    placeholders,
    brackets
  }
  const usjObj = {
    type: "USJ",
    version: "3.1",
  }
  let topArr = []
  let level1Arr = []
  let curBook = ""

  // ToDo: Check possibly streaming for big size CSV:
  // https://www.papaparse.com/faq#streaming
  // https://deadsimplechat.com/blog/csv-files-with-nodejs-papaparse/
  // eslint-disable-next-line no-undef
  Papa.parse(csvData, {
    header: true,
    // eslint-disable-next-line no-unused-vars
    transformHeader: (str,_inx) => str.replace(/\s+/g, ''),
    step: function(result) {
      const lineObj = result?.data
      // Process each row of the csv as it is parsed
      const bcvObj = getBcvObj(lineObj)
      if (result?.data?.VerseId) {
        if (curBook !== bcvObj.bookName) {
          curBook = bcvObj.bookName
          console.log(curBook)
        }
      }
      if ((bcvObj?.ch === 1) && (bcvObj?.v === 1)) {
        if ((topArr) && (topArr.length>0)) {
          if (level1Arr.length>0) {
            // Now dump all current level_1 content into a paragraph (in the content field)
            topArr.push({
              type: "para",
              marker: "p",
              content: joinIfStr(level1Arr)
            })
          }
          level1Arr = []
          usjObj.content = topArr    
          postMessage({
            bookIdStr: ws.curPtxId,
            usjObj
          })
          topArr = []
        }  
        ws.curPtxId = bcvObj.ptxId
        ws.curBookName = bcvObj.bookName
        generateBookName(topArr,bcvObj)
      }
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
      postMessage({
        parserFinished: true,
        bookIdStr: ws.curPtxId,
        usjObj
      })
    },
    // dynamicTyping: true,
  })
}

onmessage = function (event) {
  console.log('Received message from the main thread:', event.data)
  console.log(event.data)
  const {keepStrongNumbers,placeholders,brackets} = event.data
  fetch(`/bsb_tables.csv`)
  .then(response => {
    response.text().then(txt => {
      csv2usj(txt,keepStrongNumbers,placeholders,brackets)
    })
  })
}