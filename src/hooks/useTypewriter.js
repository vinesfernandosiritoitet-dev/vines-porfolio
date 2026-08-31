import { useEffect, useState } from 'react'

export default function useTypewriter(
  words,
  { typeSpeed = 90, deleteSpeed = 45, pause = 1600 } = {},
) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index % words.length]
    let timeout

    if (!deleting && text === word) {
      timeout = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === '') {
      timeout = setTimeout(() => {
        setDeleting(false)
        setIndex((i) => (i + 1) % words.length)
      }, typeSpeed)
    } else {
      timeout = setTimeout(
        () => {
          setText(word.slice(0, deleting ? text.length - 1 : text.length + 1))
        },
        deleting ? deleteSpeed : typeSpeed,
      )
    }

    return () => clearTimeout(timeout)
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause])

  return text
}
