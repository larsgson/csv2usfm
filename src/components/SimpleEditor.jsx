/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from "react"
import { Editor } from '@oce-editor-tools/mui-core'
import EpiteleteHtml from "epitelete-html"
import { usfm2perf } from "../helpers/usfm2perf"

function SimpleEditor({
  reference,
  onReferenceSelected,
  docSetId,
  usfmText,
  ...props
}) {
  const verbose = true;
  const [ready, setReady] = useState(false);
  const epiteleteHtml = useMemo(
    () =>
      new EpiteleteHtml({
        proskomma: undefined,
        docSetId,
        options: { historySize: 100 },
      }),
    [docSetId]
  );

  const onSave = (bookCode, usfmText) => {
    console.log(`save button clicked: ${docSetId} ${bookCode}`, usfmText)
    // SaveFile(filePath,usfmText)
  };

  useEffect(() => {
    async function loadUsfm() {
      const tempPerf = usfm2perf(usfmText)
      await epiteleteHtml.sideloadPerf('XYZ', tempPerf)
      setReady(true)
    }
    if (epiteleteHtml) loadUsfm()
  }, [epiteleteHtml, usfmText])

  const onRenderToolbar = ({ items }) => {
    const _items = items.filter((item) => item?.key === "print")
    return [..._items]
  }

  const editorProps = {
    epiteleteHtml,
    bookId: 'XYZ',
    reference,
    onReferenceSelected,
    onSave,
    onRenderToolbar,
    verbose,
    ...props,
  }

  return <>{ready ? <Editor {...editorProps} /> : "Loading..."}</>
}

export default SimpleEditor