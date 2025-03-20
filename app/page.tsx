/* eslint-disable react/no-unescaped-entities */
"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import {
  Play,
  Lightbulb,
  Grid3X3,
  LineChart,
  Github,
  ChevronRight,
  Braces,
  Footprints,
  Target,
  Sparkles,
  Brain,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const [animatedMaze, setAnimatedMaze] = useState<boolean[][]>(
    Array(8)
      .fill(0)
      .map(() => Array(8).fill(false)),
  )
  
  const [algorithmIndex, setAlgorithmIndex] = useState(0)
  const algorithms = ["A* Algorithm", "BFS Algorithm", "DFS Algorithm"]
  
  // Define different paths for different algorithms
  const algorithmPaths = [
    // A* path
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 4],
      [4, 4],
      [4, 5],
      [4, 6],
      [5, 6],
      [6, 6],
      [7, 6],
      [7, 7],
    ],
    // BFS path
    [
      [0, 0],
      [1, 0],
      [0, 1],
      [2, 0],
      [1, 1],
      [0, 2],
      [3, 0],
      [2, 1],
      [1, 2],
      [3, 1],
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 4],
      [4, 4],
      [4, 5],
      [4, 6],
      [5, 6],
      [6, 6],
      [7, 6],
      [7, 7],
    ],
    // DFS path
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],
      [6, 0],
      [5, 0],
      [5, 1],
      [5, 2],
      [4, 2],
      [3, 2],
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 4],
      [4, 4],
      [4, 5],
      [4, 6],
      [5, 6],
      [6, 6],
      [7, 6],
      [7, 7],
    ],
  ]

  // Animate the maze visualization with error handling
  const animateMaze = useCallback(() => {
    const currentPath = algorithmPaths[algorithmIndex]
    let currentIndex = 0
    
    // Clear the maze first
    setAnimatedMaze(Array(8).fill(0).map(() => Array(8).fill(false)))
    
    const interval = setInterval(() => {
      if (currentIndex < currentPath.length) {
        setAnimatedMaze((prev) => {
          const newMaze = prev.map((row) => [...row])
          // Safely access path elements
          if (currentIndex < currentPath.length) {
            const [row, col] = currentPath[currentIndex]
            newMaze[row][col] = true
          }
          return newMaze
        })
        currentIndex++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setAnimatedMaze(Array(8).fill(0).map(() => Array(8).fill(false)))
          // Switch to next algorithm
          setAlgorithmIndex((prev) => (prev + 1) % algorithms.length)
        }, 1000)
      }
    }, 200)

    return () => clearInterval(interval)
  }, [algorithmIndex])

  // Reset and start animation when algorithm changes
  useEffect(() => {
    const animationTimer = setTimeout(() => {
      animateMaze()
    }, 500)
    
    return () => clearTimeout(animationTimer)
  }, [algorithmIndex, animateMaze])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="text-white px-3 py-1 text-sm bg-indigo-500/20 border-indigo-400 mb-4">
              AI Pathfinding Visualizer
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Explore the <span className="text-cyan-400">Intelligence</span> Behind Pathfinding
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
              Visualize how AI algorithms navigate through complex mazes in real-time. Create your own challenges and
              watch different strategies compete.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-1">
                <Link href="/game">
                  <Play className="h-4 w-4" />
                  Start Exploring
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-transparent border border-slate-600 hover:bg-slate-800/50 transition-all hover:-translate-y-1">
                <a href="#algorithms" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Learn More
                </a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/40 to-indigo-500/40 rounded-xl blur-lg opacity-75 animate-pulse"></div>
            <Card className="relative bg-slate-800/90 border-slate-700 overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <div className="p-6 pb-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      {algorithms[algorithmIndex]}
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-8 grid-rows-8 gap-1 p-6 aspect-square">
                  {animatedMaze.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      // Start and end points
                      if (rowIndex === 0 && colIndex === 0) {
                        return <div key={`${rowIndex}-${colIndex}`} className="bg-amber-500 rounded-md animate-pulse"></div>
                      }
                      if (rowIndex === 7 && colIndex === 7) {
                        return <div key={`${rowIndex}-${colIndex}`} className="bg-emerald-500 rounded-md animate-pulse"></div>
                      }

                      // Walls
                      if (
                        [
                          [0, 3],
                          [1, 1],
                          [1, 3],
                          [1, 5],
                          [2, 1],
                          [2, 5],
                          [2, 7],
                          [3, 1],
                          [3, 3],
                          [3, 5],
                          [3, 7],
                          [4, 1],
                          [4, 3],
                          [5, 3],
                          [5, 4],
                          [5, 5],
                          [5, 7],
                          [6, 1],
                          [6, 3],
                          [7, 1],
                          [7, 3],
                          [7, 5],
                        ].some(([r, c]) => r === rowIndex && c === colIndex)
                      ) {
                        return <div key={`${rowIndex}-${colIndex}`} className="bg-slate-700 rounded-md shadow-inner"></div>
                      }

                      // Path cells
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`rounded-md transition-colors duration-200 ${
                            cell ? "bg-cyan-500/80 scale-90 shadow-lg shadow-cyan-500/20" : "bg-slate-900"
                          }`}
                        ></div>
                      )
                    }),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section - New */}
      <section className="py-12 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard number="3+" label="Algorithms" icon={<Brain className="h-8 w-8 text-indigo-400 opacity-70" />} />
            <StatCard number="100%" label="Open Source" icon={<Github className="h-8 w-8 text-cyan-400 opacity-70" />} />
            <StatCard number="Real-time" label="Visualization" icon={<RefreshCw className="h-8 w-8 text-purple-400 opacity-70" />} />
            <StatCard number="∞" label="Possible Mazes" icon={<Grid3X3 className="h-8 w-8 text-teal-400 opacity-70" />} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 text-sm bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Visualization Tools</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Explore the capabilities of our maze solver and create your own pathfinding challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Grid3X3 className="h-10 w-10 text-cyan-400" />}
              title="Custom Maze Creation"
              description="Design your own mazes by adding walls and setting target positions to test different algorithms"
              accentColor="cyan"
            />

            <FeatureCard
              icon={<Braces className="h-10 w-10 text-indigo-400" />}
              title="Multiple Algorithms"
              description="Compare BFS, DFS, and A* algorithms side by side to understand their different approaches"
              accentColor="indigo"
            />

            <FeatureCard
              icon={<Footprints className="h-10 w-10 text-purple-400" />}
              title="Step-by-Step Visualization"
              description="Watch the search process unfold with clear highlighting of visited cells and solution paths"
              accentColor="purple"
            />

            <FeatureCard
              icon={<Target className="h-10 w-10 text-rose-400" />}
              title="Adjustable Parameters"
              description="Modify maze size and animation speed to customize your experience"
              accentColor="rose"
            />

            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-amber-400" />}
              title="Interactive Learning"
              description="Learn about AI pathfinding through hands-on experimentation and visual feedback"
              accentColor="amber"
            />

            <FeatureCard
              icon={<LineChart className="h-10 w-10 text-emerald-400" />}
              title="Performance Insights"
              description="Gain intuition about algorithm efficiency by observing their search patterns"
              accentColor="emerald"
            />
          </div>
        </div>
      </section>

      {/* Algorithms Section */}
      <section id="algorithms" className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 text-sm bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Algorithms</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Understanding Pathfinding Strategies</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Explore the different approaches to solving maze navigation problems
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <AlgorithmCard
              name="Breadth-First Search"
              description="Explores all neighbor nodes at the present depth before moving to nodes at the next depth level"
              strengths={["Guarantees shortest path", "Complete for finite spaces", "Optimal for unweighted graphs"]}
              weaknesses={["Higher memory usage", "Slower in large open spaces"]}
              bestFor="Finding shortest paths in unweighted graphs"
              highlight={true}
              accentColor="indigo"
            />

            <AlgorithmCard
              name="Depth-First Search"
              description="Explores as far as possible along each branch before backtracking to explore other branches"
              strengths={["Low memory usage", "Can find solutions quickly in maze-like structures"]}
              weaknesses={["Does not guarantee shortest path", "May get lost in infinite branches"]}
              bestFor="Memory-constrained environments and maze-like structures"
              highlight={false}
              accentColor="cyan"
            />

            <AlgorithmCard
              name="A* Search"
              description="Combines Dijkstras algorithm with heuristic estimates to efficiently find optimal paths"
              strengths={["Optimal paths", "Efficient exploration", "Adaptable with different heuristics"]}
              weaknesses={["Heuristic calculation overhead", "Memory usage with large search spaces"]}
              bestFor="Finding optimal paths efficiently in complex environments"
              highlight={true}
              accentColor="purple"
            />
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-1">
              <Link href="/game">
                Try Them Yourself
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section - New */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 text-sm bg-purple-500/10 text-purple-400 border-purple-500/20">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Students Say</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Feedback from AI course students who used MazeMind
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="MazeMind helped me visualize search algorithms in a way that textbooks never could. I finally understand the differences between BFS and DFS!"
              author="Sarah M."
              role="Computer Science Student"
              accentColor="indigo"
            />
            <TestimonialCard
              quote="The interactive elements made learning about pathfinding algorithms engaging. Being able to create custom mazes and test different approaches was invaluable."
              author="David K."
              role="AI Course Student"
              highlight={true}
              accentColor="cyan"
            />
            <TestimonialCard
              quote="I used this for my AI class project and it was perfect. The visualization really helped me explain algorithm behavior in my presentation."
              author="Amir J."
              role="Graduate Student"
              accentColor="purple"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-3 py-1 text-sm bg-emerald-500/10 text-emerald-400 border-emerald-500/20">About</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The MazeMind Project</h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              An educational tool for visualizing and understanding AI pathfinding algorithms
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-slate-800/50 rounded-xl p-8 border border-slate-700 shadow-xl backdrop-blur-sm">
            <p className="text-slate-300 mb-6">
              This project was developed as an educational tool for the Introduction to AI course taught by Professor
              Somia Lekehali. It demonstrates practical applications of fundamental AI search algorithms through an
              interactive maze solver.
            </p>

            <p className="text-slate-300 mb-6">
              MazeMind allows users to visualize how different pathfinding algorithms approach the same problem,
              providing insights into their strengths, weaknesses, and appropriate use cases. The interactive nature of
              the tool makes it an excellent resource for students learning about AI concepts.
            </p>

            <div className="pt-6 border-t border-slate-700">
              <h3 className="text-xl font-semibold mb-4">Developers</h3>
              <section className=" flex md:flex-row flex-col gap-5 md:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
                  AYZ
                </div>
                <div>
                  <h4 className="font-medium">Ahmed Yassine Zeraibi</h4>
                  <p className="text-sm text-slate-400">Group 1CS4</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
                  YB
                </div>
                <div>
                  <h4 className="font-medium">Yasseur Boutobba</h4>
                  <p className="text-sm text-slate-400">Group 1CS4</p>
                </div>
              </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-600/30 via-cyan-500/20 to-purple-500/10 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Explore Pathfinding?</h2>
              <p className="text-slate-300 mb-8">
                Jump into the interactive maze solver and see these algorithms in action
              </p>
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 gap-2 shadow-xl hover:shadow-indigo-500/30 transition-all hover:-translate-y-1">
                <Link href="/game">
                  <Play className="h-4 w-4" />
                  Start Exploring
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 bg-slate-900/90">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Grid3X3 className="h-5 w-5 text-cyan-400" />
              <span className="font-bold">MazeMind</span>
            </div>

            <div className="text-sm text-slate-400">AI Pathfinding Project · Introduction to AI · ESTIN</div>

            <div className="mt-4 md:mt-0">
              <Button asChild variant="ghost" size="sm" className="hover:bg-indigo-500/10">
                <a href="https://github.com/aceiny/maze-mind" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  View Source
                </a>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  accentColor = "cyan"
}: {
  icon: React.ReactNode
  title: string
  description: string
  accentColor?: string
}) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-500 transition-all group hover:-translate-y-1 duration-300 shadow-lg hover:shadow-xl">
      <CardContent className="p-6">
        <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className={`text-xl font-semibold mb-2 group-hover:text-${accentColor}-400 transition-colors`}>{title}</h3>
        <p className="text-slate-300">{description}</p>
      </CardContent>
    </Card>
  )
}

// Algorithm Card Component
function AlgorithmCard({
  name,
  description,
  strengths,
  weaknesses,
  bestFor,
  highlight,
  accentColor = "indigo"
}: {
  name: string
  description: string
  strengths: string[]
  weaknesses: string[]
  bestFor: string
  highlight: boolean
  accentColor?: string
}) {
  return (
    <div className="relative group">
      {highlight && (
        <div className={`absolute -inset-1 bg-gradient-to-r from-${accentColor}-500/50 to-${accentColor}-500/30 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity`}></div>
      )}
      <Card className={`relative h-full bg-slate-800/80 border-slate-700 ${highlight ? `border-${accentColor}-500/50` : ""} transition-all group-hover:-translate-y-1 duration-300 shadow-lg group-hover:shadow-xl`}>
        <CardContent className="p-6 flex flex-col h-full">
          <h3 className={`text-xl font-semibold mb-3 group-hover:text-${accentColor}-400 transition-colors`}>{name}</h3>
          <p className="text-slate-300 mb-6">{description}</p>

          <div className="space-y-4 mt-auto">
            <div>
              <h4 className={`text-sm font-medium text-${accentColor}-400 mb-2`}>Strengths</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`text-${accentColor}-400 mr-2`}>+</span> {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={`text-sm font-medium text-${accentColor}-400 mb-2`}>Weaknesses</h4>
              <ul className="text-sm text-slate-300 space-y-1">
                {weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`text-${accentColor}-400 mr-2`}>-</span> {weakness}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-700">
              <h4 className="text-sm font-medium mb-1">Best For</h4>
              <p className={`text-sm text-${accentColor}-400`}>{bestFor}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// New Stats Card Component
function StatCard({
  number,
  label,
  icon,
}: {
  number: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <Card className="bg-slate-800/30 border-slate-700 shadow-lg hover:border-slate-500 transition-all hover:-translate-y-1 duration-300">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-3">{icon}</div>
        <div className="text-2xl md:text-3xl font-bold text-white mb-1">{number}</div>
        <div className="text-sm text-slate-400">{label}</div>
      </CardContent>
    </Card>
  )
}

// New Testimonial Card Component
function TestimonialCard({
  quote,
  author,
  role,
  highlight = false,
  accentColor = "cyan"
}: {
  quote: string
  author: string
  role: string
  highlight?: boolean
  accentColor?: string
}) {
  return (
    <div className="relative group">
      {highlight && (
        <div className={`absolute -inset-1 bg-gradient-to-r from-${accentColor}-500/50 to-${accentColor}-500/30 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity`}></div>
      )}
      <Card className={`relative h-full bg-slate-800/80 border-slate-700 ${highlight ? `border-${accentColor}-400/50` : ""} transition-all group-hover:-translate-y-1 duration-300 shadow-lg hover:shadow-xl`}>
        <CardContent className="p-6 flex flex-col h-full">
          <div className={`text-${accentColor}-400 text-4xl font-serif mb-4`}>&quot;</div>
          <p className="text-slate-300 mb-6 italic">{quote}</p>
          <div className="mt-auto pt-4 border-t border-slate-700">
            <h4 className="font-medium">{author}</h4>
            <p className="text-sm text-slate-400">{role}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}