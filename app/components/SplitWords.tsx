'use client'

interface SplitWordsProps {
  text: string
}

export default function SplitWords({ text }: SplitWordsProps) {
  const words = text.trim().split(/\s+/)

  return (
    <>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="w">
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}
