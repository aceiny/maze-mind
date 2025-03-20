import { Button } from '@/components/ui/button'
import { Github, Grid3X3 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <header className="w-full py-6 px-4 sticky top-0  backdrop-blur-md z-10">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Grid3X3 className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">MazeMind</span>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/#features" className="text-slate-600 hover:text-white transition-colors">
          Features
        </Link>
        <Link href="/#algorithms" className="text-slate-600 hover:text-white transition-colors">
          Algorithms
        </Link>
        <Link href="/#about" className="text-slate-600 hover:text-white transition-colors">
          About
        </Link>
      </nav>
      <div className="flex gap-3">
        <Button asChild variant="outline" size="sm" className="shadow-lg hover:shadow-primary/20">
          <Link href="https://github.com/aceiny/maze-mind" target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
        </Button>
        <Button asChild size="sm" className="shadow-lg hover:shadow-primary/40 md:hidden">
          <Link href="/game">Try Now</Link>
        </Button>
      </div>
    </div>
  </header>  )
}

export default Navbar