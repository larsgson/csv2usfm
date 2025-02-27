// import {bookName, crossRef, para, footNote} from 'util/helpers'

function strip(html){
  let doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

// eslint-disable-next-line no-unused-vars
export const generateBookName = (content,_lineItem) => {
  content.push({
    type: "book",
    marker: "id",
    code: "TIT",
  })
  content.push({
    type: "para", 
    marker: "ide", 
    content: ["UTF-8\n"]
  })
  content.push({
    type: "para", 
    marker: "h", 
    content: ["TITE \n"]
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

export const parseLinePart1 = (ws,content,lineItem) => {
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

export const parseLinePart2 = (ws,content,lineItem) => {
  if (lineItem?.space) content.push(lineItem?.space)
  if (lineItem?.begQ) content.push(lineItem?.begQ)  
  if (lineItem?.BSBversion) {
    content.push({
      type: "char",
      marker: "w",
      content: [ `${lineItem.BSBversion}` ],
      strong: lineItem?.StrGrk
    })
  }
  if (lineItem?.pnc) content.push(lineItem?.pnc)
  if (lineItem?.endQ) content.push(lineItem?.endQ)
}

// ToDo: Check possibly streaming for big size CSV:
// https://www.papaparse.com/faq#streaming
// https://deadsimplechat.com/blog/csv-files-with-nodejs-papaparse/