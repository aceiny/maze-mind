import { Button } from '@/components/ui/button'
import { Github, Grid3X3 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  const routes = [
    { name : 'Game', href: '/game'},
    { name: 'Features', href: '/#features' },
    { name: 'Algorithms', href: '/#algorithms' },
    { name: 'About', href: '/#about' },
  ]
  return (
    <header className="w-full py-6 px-4 sticky top-0  backdrop-blur-md z-10">
    <div className="flex justify-between items-center">
      <Link href={"/"} className="flex items-center gap-2">
        <Grid3X3 className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">MazeMind</span>
      </Link>
      <nav className="hidden md:flex items-center gap-8">
        {routes.map((route, index) => {
          return (
            <Link key={index} href={route.href} className="text-slate-600 hover:text-white transition-colors">
            {route.name}
            </Link>
          )
        })}
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