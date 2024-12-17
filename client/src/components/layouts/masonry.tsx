import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MasonryLayoutProps {
  children: React.ReactNode[]
}

export const MasonryLayout = ({ children }: MasonryLayoutProps) => {
  const [columns, setColumns] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= 1200) setColumns(4)
      else if (width >= 992) setColumns(3)
      else if (width >= 768) setColumns(2)
      else setColumns(1)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const columnWrapperStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '1rem',
  }

  const columnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: `${100 / columns}%`,
  }

  const childrenArray = React.Children.toArray(children)
  const columnsContent = Array.from({ length: columns }, (_, index) =>
    childrenArray.filter((_, i) => i % columns === index)
  )

  return (
    <div style={columnWrapperStyle}>
      {columnsContent.map((column, i) => (
        <div key={i} style={columnStyle}>
          {column.map((child, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {child}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}
