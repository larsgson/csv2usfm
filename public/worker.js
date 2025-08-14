/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-undef
importScripts("papaparse.min.js","en_bcv_parser.min.js")

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
  "Psalm": "PSA",
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

const strip = (str) => str.trim()

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

const stripHeader = (str) => {
  const tempStr = strip(str)
  const tempStr2 = tempStr.replace(/<p class=\|hdg\|>/g, "")
  return tempStr2
}

const removeTags = (str) => {
  return str.replace(/<[^>]*>/g, '')
               .replace(/\s{2,}/g, '')
               .trim();
}

const convertItalicsTags = (arr,str) => {
  const fqaIdStr = "literally "
  const fqaIdLen = fqaIdStr.length
  const fqIdStr = "<i>"
  const fqIdLen = fqIdStr.length
  const fqaFullIdStr = fqaIdStr+fqIdStr
  const fqaFullIdLen = fqaFullIdStr.length
  const fqEndIdStr = "</i>"
  const fqEndIdLen = fqEndIdStr.length
  let done = false
  let curStr = strip(str)
  while (!done) {
    const fqaPos = curStr.toLowerCase().indexOf(fqaFullIdStr)
    const fqPos = curStr.indexOf(fqIdStr)
    if ((fqaPos>=0) && ((fqPos<0) || (fqPos>fqaPos))) {
      if (fqaPos>0) {
        arr.push(curStr.slice(0,fqaPos+fqaIdLen))
        // console.log(curStr.slice(0,fqaPos+fqaIdLen))
      }
      const newStr = curStr.slice(fqaPos)
      curStr = newStr
      // console.log(curStr)
      const fqaEndPos = curStr.indexOf(fqEndIdStr)
      if (fqaEndPos>=0) {
        const tempStr = curStr.slice(fqaFullIdLen,fqaEndPos).replace(/ {2}/g, " ") // replace "  " with " "
        arr.push({
          "type": "char",
          "marker": "fqa",
          "content": [ removeTags(tempStr) ]
        })
        // console.log(curStr.slice(fqaFullIdLen,fqaEndPos))
      }
      const newStr2 = curStr.slice(fqaEndPos+fqEndIdLen)
      curStr = newStr2
      // console.log(curStr)
      // console.log("fqa "+str)
    } else if (fqPos>=0) {
      if (fqPos>0) {
        arr.push(curStr.slice(0,fqPos))
        // console.log(curStr.slice(0,fqPos))
      }
      const newStr = curStr.slice(fqPos)
      curStr = newStr
      // console.log(curStr)
      const fqEndPos = curStr.indexOf(fqEndIdStr)
      if (fqEndPos>=0) {
        const tempStr = curStr.slice(fqIdLen,fqEndPos)
        arr.push({
          "type": "char",
          "marker": "fq",
          "content": [ removeTags(tempStr) ]
        })
        // console.log(arr)
        // console.log(removeTags(tempStr))
      }
      const newStr2 = curStr.slice(fqEndPos+fqEndIdLen)
      curStr = newStr2
      // console.log(curStr)
      // console.log("fq "+str)  
    } else {
      arr.push(curStr)
      done = true
    } 
  }
}


const replaceUnneeded = (str) => {
  let tempStr = str.replace(/ʼ/g, "’") // replace "ʼ" with "’"
  // The above should hopefully be possible to handle - in reverse - from the generated usj from Martin Hosken
  tempStr = tempStr.replace(/(\S+ )\s+/g, "$1") // remove multiple " "
  tempStr = tempStr.replace(/ \. /g, ". ") // replace " . " with ". "
  tempStr = tempStr.replace(/ , /g, ", ") // replace " , " with ", "
  tempStr = tempStr.replace(/ ([.|,|:|;|—|)|?|!])/g, "$1") // replace space before"
  tempStr = tempStr.replace(/([(|—]) /g, "$1") // replace space after"
  tempStr = tempStr.replace(/([.|?|!]) ”/g, "$1”") // replace ". ”" with ".”"
  tempStr = tempStr.replace(/, ”/g, ",”") // replace ", ”" with ",”"
  tempStr = tempStr.replace(/, ’/g, ",’") // replace ", ’" with ",’"
  tempStr = tempStr.replace(/ .”/g, ".”") // replace " .”" with ".”"
  tempStr = tempStr.replace(/ .’/g, ".’") // replace " .'" with ".'"
  tempStr = tempStr.replace(/“ (\S+)/g, "“$1") // replace "“ " with "“"
  tempStr = tempStr.replace(/”(\S+)/g, "” $1") // replace "”" with "” "
  tempStr = tempStr.replace(/(\S+) ”/g, "$1”") // replace " ”" with "”"
  // remove " " at the beginning (trim)
  tempStr = strip(tempStr)
  // if (str!==tempStr) {
  //   console.log("'"+str+"' -> '"+tempStr+"'")
  // }
  return tempStr
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
      content: [ stripHeader(lineItem.Hdg) ]
    })
  }
  if (lineItem?.Crossref) {
    content.push({
      type: "para",
      marker: "r",
      content: [ `${removeTags(lineItem.Crossref)}` ]
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
  let curStr = ""
  if (lineItem?.begQ) curStr = lineItem?.begQ
  if (lineItem?.BSBversion) {
    let addStr = lineItem.BSBversion?.trim()
    if (!ws.brackets) {
      if (lineItem.BSBversion === " - ") {
        addStr = ""
      }
      const tempStr1 = addStr
      addStr = strip(tempStr1.replace(/\. \. \./g,""))
    }
    curStr+=addStr
  }
  if (!ws.brackets) {
    const tempStr1 = curStr.replace(/vvv/g,"")
    const tempStr2 = tempStr1.replace(/\[|\]|{|}/g,"")
    curStr=tempStr2
  }
  if (lineItem?.pnc) {
    if (lineItem?.endQ) {
      curStr+=lineItem?.pnc+lineItem?.endQ+' '
    } else {
      curStr+=lineItem?.pnc+' '
    }
  } else if (lineItem?.endQ) {
    curStr+=lineItem.endQ
  } else {
    curStr+=' '
  }
  if (ws.keepStrongNumbers) {
    content.push({
      type: "char",
      marker: "w",
      content: [ `${curStr}` ],
      strong: lineItem?.StrGrk
    })
  } else if (curStr.length>0) {
    content.push(curStr)
  }
  let ftContent
  if (lineItem?.footnotes) {
    let newFtStr = strip(lineItem?.footnotes)
    let hasRef = false
    let curInx = 0
    const parsedBcv = ws.bcv.parse(newFtStr)
    ftContent = []
    if (parsedBcv?.entities?.length>0) { // Bible references might have been detected
      parsedBcv.entities.forEach(e => {
        if ((e.type!=="b") && (e.type!=="translation_sequence")) {
          if (e?.passages?.length>0) {
            if (((e.type==="bcv") || (e.type==="range")) && (e?.absolute_indices)) {
              // Entity is detected
              const i0 = e.absolute_indices[0]
              const i1 = e.absolute_indices[1]
              const refStr = strip(newFtStr?.substring(i0,i1))
              const preStr = strip(newFtStr?.substring(curInx,i0))
              convertItalicsTags(ftContent,preStr)
              ftContent.push({
                type: "char",
                marker: "xt",
                content: [ refStr ]
              })
              curInx = i1
              hasRef = true
            } else {
              const pLen = e.passages?.length
              e.passages.forEach((p,i) => {
                if ((p.type!=="b") 
                  && (p.type!=="translation_sequence") 
                  && (p.type!=="integer")
                  && (p?.absolute_indices)) 
                {
                  // Passage is detected
                  const i0 = p.absolute_indices[0]
                  let i1 = p.absolute_indices[1]
                  let j = 1
                  while (pLen>i+j) { // parse integers - as long as they are adjacent
                    const pNext = e.passages[i+j]
                    if ((pNext?.type==="integer") && (p?.absolute_indices)) {
                      i1 = pNext.absolute_indices[1]
                      j += 1
                    } else { // end here
                      j = pLen
                    }
                  } 
                  let refStr = strip(newFtStr?.substring(i0,i1))
                  const preStr = strip(newFtStr?.substring(curInx,i0))
                  convertItalicsTags(ftContent,preStr)
                  ftContent.push({
                    type: "char",
                    marker: "xt",
                    content: [ refStr ]
                  })
                  curInx = i1
                  hasRef = true
                }
              })  
            }
          }
        }
      })
      if (hasRef && (curInx !== newFtStr.length)) {
        const remainingStr = newFtStr?.substring(curInx,newFtStr.length)
        convertItalicsTags(ftContent,remainingStr)
      }
    }
    if (!hasRef) {
      convertItalicsTags(ftContent,newFtStr)
      // ftContent = [ `${newFtStr}` ]
    }
    content.push({
      "type": "note",
      "marker": "f",
      "content": [
        {
          "type": "char",
          "marker": "fr",
          "content": [ `${ws.curCh}:${ws.curV}` ]
        },
        {
          "type": "char",
          "marker": "ft",
          "content": ftContent
        }
      ],
      "caller": "+"
    })
  }
  if (lineItem?.Endtext && lineItem.Endtext.length>0) {
    content.push(lineItem?.Endtext)
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
          const dumpStr = replaceUnneeded(acc.tempStr)
          if (dumpStr.length>0) acc.retArr.push(dumpStr)
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
  const dumpStr = replaceUnneeded(retObj.tempStr)
  if (dumpStr.length>0) retObj.retArr.push(dumpStr)
  return retObj.retArr    
}

const csv2usj = (csvData,keepStrongNumbers,placeholders,brackets) => {
  const ws = {
  // eslint-disable-next-line no-undef
    bcv : new bcv_parser(),
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
  let storedPMarker = "p"
  let curBook = ""

  // eslint-disable-next-line no-undef
  Papa.parse(csvData, {
    header: true,
    // eslint-disable-next-line no-unused-vars
    transformHeader: (str,_inx) => str.replace(/\s+/g, ''),
    step: function(result) {
      const lineObj = result?.data
      // Process each row of the csv as it is parsed
      const bcvObj = getBcvObj(lineObj)
      if (lineObj?.VerseId) {
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
          const checkStr = lineObj?.Par
          let marker = storedPMarker
          storedPMarker = "p" // regular marker - as default
          const regexp = /<p class=\|([A-Z|a-z]*)(\d*)/g
          const resArr = [...checkStr.matchAll(regexp)]
          if (resArr) {
            const matchObj = resArr[0]
            if (matchObj && matchObj.length>2) {
              const idStr = matchObj[1]
              if (idStr==="list") {
                storedPMarker = `li${matchObj[2]}` // li(nbr)
              } else if (idStr==="indent") {
                storedPMarker = `q${matchObj[2]}` // q(nbr)
              }
            }
          }
          // Now dump all current level_1 content into a paragraph (in the content field)
          topArr.push({
            type: "para",
            marker,
            content: joinIfStr(level1Arr)
          })
          level1Arr = []    
        }
        parseLinePart1(ws,topArr,lineObj,bcvObj)
        // console.log(topArr)
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
          marker: storedPMarker,
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
  console.log('Received message from the main thread:')
  console.log(event.data)
  const {keepStrongNumbers,placeholders,brackets} = event.data
  fetch(`/bsb_tables.csv`)
  // fetch(`/rom.csv`)
  .then(response => {
    response.text().then(txt => {
      csv2usj(txt,keepStrongNumbers,placeholders,brackets)
    })
  })
}