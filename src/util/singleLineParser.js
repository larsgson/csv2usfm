// import {bookName, crossRef, para, footNote} from 'util/helpers'

// eslint-disable-next-line no-unused-vars
export const generateBookName = (usj,_lineItem) => {
  usj.content.push({
    type: "book",
    marker: "id",
    code: "TIT",
  })
  usj.content.push({
    type: "para", 
    marker: "ide", 
    content: ["UTF-8\n"]
  })
  usj.content.push({
    type: "para", 
    marker: "h", 
    content: ["TITE \n"]
  })
}

export const parseLine = (ws,usj,lineItem) => {
  if (lineItem?.space) usj.content.push(lineItem?.space)
    if (lineItem?.begQ) usj.content.push(lineItem?.begQ)  
  if (lineItem?.BSBversion) {
    const curUsj = {
      type: "char",
      marker: "w",
      content: [],
      strong: lineItem?.StrGrk
    }
    curUsj.content.push(lineItem.BSBversion)
    usj.content.push(curUsj)  
  }
  if (lineItem?.pnc) usj.content.push(lineItem?.pnc)
  if (lineItem?.endQ) usj.content.push(lineItem?.endQ)
}