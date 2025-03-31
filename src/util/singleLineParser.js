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
    code: `${bcvObj?.ptxId} - Berean Standard Bible`,
  })
  content.push({
    type: "para", 
    marker: "ide", 
    content: ["UTF-8\n"]
  })
  content.push({
    type: "para", 
    marker: "h", 
    content: [`${bcvObj?.bookName}\n`]
  })
  content.push({
    type: "para", 
    marker: "toc2", 
    content: [`${bcvObj?.bookName}\n`]
  })
  content.push({
    type: "para", 
    marker: "toc1", 
    content: [`${bcvObj?.bookName}\n`]
  })
  content.push({
    type: "para", 
    marker: "mt1", 
    content: [`${bcvObj?.bookName}\n`]
  })  
}

// Probably use this instead of cross reference ? And also for footnotes?
// {
//   type: "note",
//   marker: "x",
//   content: [
//     { type: "char", marker: "xo", content: ["2.12  "] },
//     {
//       type: "char",
//       marker: "xt",
//       content: ["Ép 1:4. Col 1:22. 2 Ti 1:9."],
//     },
//   ],
//   caller: "g",
// },

export const parseLinePart1 = (ws,content,lineItem,bcvObj) => {
  const curCh = bcvObj?.ch
  if ((curCh) && (ws.curCh !== bcvObj.ch)) {
    ws.curCh = bcvObj.ch
    content.push({
      type: "chapter",
      marker: "c",
      number: bcvObj.ch,
      sid: `${bcvObj.ptxId} ${bcvObj.ch}`
    })
  }
  if (lineItem?.Hdg) {
    content.push({
      type: "para",
      marker: "s1",
      content: [ `${strip(lineItem.Hdg)} \n` ]
    })
  }
  if (lineItem?.Crossref) {
    content.push({
      type: "para",
      marker: "r",
      content: [ `${strip(lineItem.Crossref)} \n` ]
    })
  }
}

export const parseLinePart2 = (ws,content,lineItem,bcvObj) => {
  const curV = bcvObj?.v
  if ((curV) && (ws.curV !== bcvObj.v)) {
    ws.curV = bcvObj.v
    content.push({
      type: "chapter",
      marker: "v",
      number: bcvObj.v,
      sid: `${bcvObj.ptxId} ${bcvObj.ch}:${bcvObj.v}`
    })
  }
  if (lineItem?.space) content.push(lineItem?.space)
  if (lineItem?.begQ) content.push(lineItem?.begQ)  
  if (lineItem?.BSBversion) {
    let curStr = lineItem.BSBversion.trim()
    if (lineItem?.pnc) {
      curStr+=lineItem?.pnc+' '
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
        " ",
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

// ToDo: Check possibly streaming for big size CSV:
// https://www.papaparse.com/faq#streaming
// https://deadsimplechat.com/blog/csv-files-with-nodejs-papaparse/