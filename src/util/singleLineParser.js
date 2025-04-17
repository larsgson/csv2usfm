// import {bookName, crossRef, para, footNote} from 'util/helpers'

function strip(html){
  let doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

// eslint-disable-next-line no-unused-vars
export const generateBookName = (content,bcvObj) => {
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

export const parseLinePart1 = (ws,content,lineItem,bcvObj) => {
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

export const parseLinePart2 = (ws,content,lineItem,bcvObj) => {
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
    if ((!ws.placeholdersNBrackets) && (lineItem.BSBversion === " - ")) {
      curStr = ""
    }
    if (lineItem?.pnc) {
      curStr+=lineItem?.pnc+' '
    } else {
      curStr+=' '
    }
    if (!ws.placeholdersNBrackets) {
      const tempStr1 = curStr.replace(/vvv/g,"")
      const tempStr2 = tempStr1.replace(/\. \. \./g,"")
      const tempStr3 = tempStr2.replace(/\[|\]|{|}/g,"")
      curStr=tempStr3
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