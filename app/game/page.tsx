"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Play, RotateCcw, Save, Home, ChevronRight } from "lucide-react"

interface Cell {
  X: number
  Y: number
}

interface MazeProps {
  maze: string[][]
  currentCell: Cell
  solutionPath: { x: number; y: number }[]
  visitedPath: { x: number; y: number }[]
  onCellClick?: (x: number, y: number) => void
  editMode?: boolean
}

// Maze component
const Maze = ({ maze, currentCell, solutionPath, visitedPath, onCellClick, editMode }: MazeProps) => {
  const getCellColor = (x: number, y: number) => {
    if (maze[x][y] === "1") return "bg-gray-800"
    if (maze[x][y] === "E") return "bg-red-500"
    if (x === currentCell.X && y === currentCell.Y) return "bg-yellow-400"
    if (solutionPath.some((cell) => cell.x === x && cell.y === y)) return "bg-green-400"
    if (visitedPath.some((cell) => cell.x === x && cell.y === y)) return "bg-blue-200"
    return "bg-white"
  }

  const getCellCursor = () => {
    return editMode ? "cursor-pointer" : "cursor-default"
  }

  return (
    <div className="grid gap-[1px] bg-gray-300 p-[1px] rounded-lg shadow-inner">
      {maze.map((row, x) => (
        <div key={x} className="flex gap-[1px]">
          {row.map((_, y) => (
            <div
              key={`${x}-${y}`}
              className={`w-6 h-6 md:w-7 md:h-7 ${getCellColor(x, y)} ${getCellCursor()} transition-colors duration-200`}
              onClick={() => editMode && onCellClick && onCellClick(x, y)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Generate a random maze
const generateMaze = (size: number): string[][] => {
  // Create a maze filled with walls
  const maze: string[][] = Array(size)
    .fill(0)
    .map(() => Array(size).fill("1"))

  // Set start and end points
  maze[1][1] = "0"
  maze[size - 2][size - 2] = "E"

  // Use a deterministic seed for pseudo-randomness
  const seed = size // Using size as seed makes it deterministic but different for different sizes
  let randomState = seed

  // Simple deterministic random function
  const pseudoRandom = () => {
    randomState = (randomState * 9301 + 49297) % 233280
    return randomState / 233280
  }

  // Recursive function to carve paths
  const carve = (x: number, y: number) => {
    const directions = [
      [0, 2],
      [2, 0],
      [0, -2],
      [-2, 0],
    ]

    // Shuffle directions deterministically
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(pseudoRandom() * (i + 1))
      ;[directions[i], directions[j]] = [directions[j], directions[i]]
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx
      const ny = y + dy

      if (nx > 0 && nx < size - 1 && ny > 0 && ny < size - 1 && maze[nx][ny] === "1") {
        maze[nx][ny] = "0"
        maze[x + dx / 2][y + dy / 2] = "0"
        carve(nx, ny)
      }
    }
  }

  // Start carving from the start point
  carve(1, 1)

  return maze
}

// Check if a cell is valid
const isValidCell = (x: number, y: number, size: number): boolean => {
  return x >= 0 && x < size && y >= 0 && y < size
}

// Custom hook for maze state
const useMaze = (size: number) => {
  const [maze, setMaze] = useState<string[][]>([])
  const [currentCell, setCurrentCell] = useState<Cell>({ X: 1, Y: 1 })

  // Generate maze on client-side only
  useEffect(() => {
    setMaze(generateMaze(size))
  }, [size])

  return { maze, setMaze, currentCell, setCurrentCell }
}

export default function MazeSolver() {
  const [mazeSize, setMazeSize] = useState(19)
  const { maze, setMaze, currentCell, setCurrentCell } = useMaze(mazeSize)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("")
  const [solutionPath, setSolutionPath] = useState<{ x: number; y: number }[]>([])
  const [visitedCells, setVisitedCells] = useState<{ x: number; y: number }[]>([])
  const [animationSpeed, setAnimationSpeed] = useState(40)
  const [activeTab, setActiveTab] = useState("solve")
  const [editMode, setEditMode] = useState(false)
  const [cellType, setCellType] = useState("wall")
  const [customMazes, setCustomMazes] = useState<{ name: string; maze: string[][] }[]>([])
  const [currentMazeName, setCurrentMazeName] = useState("Random Maze")

  // Run simulation
  const runSimulationAction = () => {
    if (solutionPath.length > 0) {
      setSimulationRunning(true)
      const interval = setInterval(() => {
        setSolutionPath((path) => {
          if (path.length > 0) {
            setCurrentCell({ X: path[0].x, Y: path[0].y })
            return path.slice(1)
          } else {
            setSimulationRunning(false)
            clearInterval(interval)
            return []
          }
        })
      }, 100)
    }
  }

  // Reset the maze
  const resetAction = () => {
    setSelectedAlgorithm("")
    setCurrentCell({ X: 1, Y: 1 })
    setSolutionPath([])
    setVisitedCells([])
  }

  // Generate a new random maze
  const newMazeAction = () => {
    resetAction()
    setMaze(generateMaze(mazeSize))
    setCurrentMazeName("Random Maze")
  }

  // Save custom maze
  const saveMazeAction = () => {
    const name = `Custom Maze ${customMazes.length + 1}`
    setCustomMazes([...customMazes, { name, maze: [...maze] }])
    setCurrentMazeName(name)
  }

  // Handle cell click in edit mode
  const handleCellClick = (x: number, y: number) => {
    if (!editMode) return

    // Don't allow editing the start or end points
    if ((x === 1 && y === 1) || maze[x][y] === "E") return

    const newMaze = [...maze]

    if (cellType === "wall") {
      newMaze[x][y] = newMaze[x][y] === "1" ? "0" : "1"
    } else if (cellType === "end") {
      // Remove previous end point
      for (let i = 0; i < newMaze.length; i++) {
        for (let j = 0; j < newMaze[i].length; j++) {
          if (newMaze[i][j] === "E") {
            newMaze[i][j] = "0"
          }
        }
      }
      newMaze[x][y] = "E"
    }

    setMaze(newMaze)
  }

  // BFS Algorithm
  const BfsAlgorithm = () => {
    // Initialize
    const visited: { x: number; y: number }[] = []
    const queue: { x: number; y: number }[] = []
    const parents = new Map()
    parents.set("1 1", null)
    queue.push({ x: 1, y: 1 })
    let found = false

    // Iterate
    while (queue.length > 0 && !found) {
      const curr = queue.shift()!
      visited.push(curr)
      if (maze[curr.x][curr.y] === "E") {
        found = true
        break
      }
      const neighbors = [
        { x: curr.x + 1, y: curr.y },
        { x: curr.x, y: curr.y + 1 },
        { x: curr.x, y: curr.y - 1 },
        { x: curr.x - 1, y: curr.y },
      ]
      for (const neighbor of neighbors) {
        if (
          isValidCell(neighbor.x, neighbor.y, maze[0].length) &&
          maze[neighbor.x][neighbor.y] !== "1" &&
          !visited.some((v) => v.x === neighbor.x && v.y === neighbor.y) &&
          !queue.some((q) => q.x === neighbor.x && q.y === neighbor.y)
        ) {
          queue.push(neighbor)
          parents.set(`${neighbor.x} ${neighbor.y}`, curr)
        }
      }
    }

    // Construct solution
    if (found) {
      const solutionPath: { x: number; y: number }[] = []
      let last = visited[visited.length - 1]
      while (last !== null) {
        solutionPath.unshift(last)
        last = parents.get(`${last.x} ${last.y}`)
      }

      animateSearch(visited, solutionPath)
    }
  }

  // DFS Algorithm
  const DfsAlgorithm = () => {
    // Initialize
    const visited: { x: number; y: number }[] = []
    const stack: { x: number; y: number }[] = []
    const parents = new Map()
    parents.set("1 1", null)
    stack.push({ x: 1, y: 1 })
    let found = false

    // Iterate
    while (stack.length > 0 && !found) {
      const curr = stack.pop()!
      visited.push(curr)
      if (maze[curr.x][curr.y] === "E") {
        found = true
        break
      }
      const neighbors = [
        { x: curr.x + 1, y: curr.y },
        { x: curr.x, y: curr.y + 1 },
        { x: curr.x, y: curr.y - 1 },
        { x: curr.x - 1, y: curr.y },
      ]
      for (const neighbor of neighbors) {
        if (
          isValidCell(neighbor.x, neighbor.y, maze[0].length) &&
          maze[neighbor.x][neighbor.y] !== "1" &&
          !visited.some((v) => v.x === neighbor.x && v.y === neighbor.y) &&
          !stack.some((s) => s.x === neighbor.x && s.y === neighbor.y)
        ) {
          stack.push(neighbor)
          parents.set(`${neighbor.x} ${neighbor.y}`, curr)
        }
      }
    }

    // Construct solution
    if (found) {
      const solutionPath: { x: number; y: number }[] = []
      let last = visited[visited.length - 1]
      while (last !== null) {
        solutionPath.unshift(last)
        last = parents.get(`${last.x} ${last.y}`)
      }

      animateSearch(visited, solutionPath)
    }
  }

  // A* Algorithm
  const AStarAlgorithm = () => {
    // Initialize
    const visited: { x: number; y: number }[] = []
    const openSet: { x: number; y: number; f: number; g: number; h: number }[] = []
    const parents = new Map()
    const gScore = new Map()
    const fScore = new Map()

    // Find End (x,y)
    let endPosition = { x: 0, y: 0 }
    for (let i = 0; i < maze.length; i++) {
      for (let j = 0; j < maze[i].length; j++) {
        if (maze[i][j] === "E") {
          endPosition = { x: i, y: j }
          break
        }
      }
    }

    // Heuristic function (Manhattan distance)
    const heuristic = (x: number, y: number) => {
      return Math.abs(x - endPosition.x) + Math.abs(y - endPosition.y)
    }

    // Set up for start node
    const start = { x: 1, y: 1 }
    const startKey = `1 1`
    parents.set(startKey, null)
    gScore.set(startKey, 0)
    const h = heuristic(start.x, start.y)
    fScore.set(startKey, h)
    openSet.push({ x: start.x, y: start.y, f: h, g: 0, h })

    let found = false

    // Loop
    while (openSet.length > 0 && !found) {
      // Sort by fScore
      openSet.sort((a, b) => a.f - b.f)

      // Get the node with lowest fScore
      const current = openSet.shift()!
      const currentKey = `${current.x} ${current.y}`

      // Add to visited list
      visited.push({ x: current.x, y: current.y })

      // Check if we reached the end
      if (maze[current.x][current.y] === "E") {
        found = true
        break
      }

      // Neighbors
      const neighbors = [
        { x: current.x + 1, y: current.y },
        { x: current.x, y: current.y + 1 },
        { x: current.x, y: current.y - 1 },
        { x: current.x - 1, y: current.y },
      ]

      for (const neighbor of neighbors) {
        // Skip if not valid or is a wall
        if (!isValidCell(neighbor.x, neighbor.y, maze[0].length) || maze[neighbor.x][neighbor.y] === "1") {
          continue
        }

        const neighborKey = `${neighbor.x} ${neighbor.y}`

        // Calculate new gScore
        const new_gScore = gScore.get(currentKey) + 1

        // If this path is better than previous one
        if (!gScore.has(neighborKey) || new_gScore < gScore.get(neighborKey)) {
          // Update path and scores
          parents.set(neighborKey, { x: current.x, y: current.y })
          gScore.set(neighborKey, new_gScore)
          const h = heuristic(neighbor.x, neighbor.y)
          const f = new_gScore + h
          fScore.set(neighborKey, f)

          // Add to open set if not already there
          if (!openSet.some((node) => node.x === neighbor.x && node.y === neighbor.y)) {
            openSet.push({
              x: neighbor.x,
              y: neighbor.y,
              f,
              g: new_gScore,
              h,
            })
          }
        }
      }
    }

    // Construct solution path
    if (found) {
      const solutionPath: { x: number; y: number }[] = []
      let last = visited[visited.length - 1]
      while (last !== null) {
        solutionPath.unshift(last)
        last = parents.get(`${last.x} ${last.y}`)
      }

      animateSearch(visited, solutionPath)
    }
  }

  // Animate the search process
  const animateSearch = (visited: { x: number; y: number }[], solution: { x: number; y: number }[]) => {
    setSimulationRunning(true)

    let visitedCurr = 0
    const visitedBuilder = setInterval(() => {
      if (visitedCurr < visited.length) {
        setVisitedCells((prev) => [...prev, visited[visitedCurr]])
        visitedCurr++
      } else {
        clearInterval(visitedBuilder)

        // Start solution path animation after visited cells animation is done
        setSolutionPath(solution)
        setSimulationRunning(false)
      }
    }, animationSpeed)
  }

  // Run algorithm when selected
  useEffect(() => {
    setSolutionPath([])
    setVisitedCells([])
    setCurrentCell({ X: 1, Y: 1 })

    if (selectedAlgorithm === "BFS") {
      BfsAlgorithm()
    } else if (selectedAlgorithm === "DFS") {
      DfsAlgorithm()
    } else if (selectedAlgorithm === "A*") {
      AStarAlgorithm()
    }
  }, [selectedAlgorithm])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-slate-800">{currentMazeName}</h1>
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-6">
            {/* Maze display */}
            <Card className="order-2 lg:order-1 flex items-center justify-center p-4 overflow-auto">
              <Maze
                maze={maze}
                currentCell={currentCell}
                solutionPath={solutionPath}
                visitedPath={visitedCells}
                onCellClick={handleCellClick}
                editMode={editMode}
              />
            </Card>

            {/* Controls */}
            <Card className="order-1 lg:order-2 lg:w-80">
              <CardHeader>
                <CardTitle>Maze Controls</CardTitle>
                <CardDescription>Configure and solve your maze</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4">
                    <TabsTrigger value="solve">Solve</TabsTrigger>
                    <TabsTrigger value="create">Create</TabsTrigger>
                  </TabsList>

                  <TabsContent value="solve" className="space-y-6">
                    {/* Algorithm selection */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">Algorithm</h3>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-slate-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                BFS finds the shortest path, DFS explores deeply first, A* uses heuristics to find an
                                efficient path.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Select
                        value={selectedAlgorithm}
                        onValueChange={setSelectedAlgorithm}
                        disabled={simulationRunning}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BFS">Breadth-First Search</SelectItem>
                          <SelectItem value="DFS">Depth-First Search</SelectItem>
                          <SelectItem value="A*">A* Search</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Animation speed */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">Animation Speed</h3>
                        <span className="text-xs text-slate-500">{animationSpeed}ms</span>
                      </div>
                      <Slider
                        value={[animationSpeed]}
                        onValueChange={(value) => setAnimationSpeed(value[0])}
                        min={10}
                        max={200}
                        step={10}
                        disabled={simulationRunning}
                      />
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="default"
                        className="gap-2"
                        disabled={simulationRunning || !solutionPath.length}
                        onClick={runSimulationAction}
                      >
                        <Play className="w-4 h-4" />
                        Run
                      </Button>
                      <Button variant="outline" className="gap-2" disabled={simulationRunning} onClick={resetAction}>
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="create" className="space-y-6">
                    {/* Edit mode toggle */}
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="edit-mode" className="font-medium text-sm">
                        Edit Mode
                      </Label>
                      <Switch
                        id="edit-mode"
                        checked={editMode}
                        onCheckedChange={(checked) => {
                          setEditMode(checked)
                          if (checked) {
                            resetAction()
                          }
                        }}
                        disabled={simulationRunning}
                      />
                    </div>

                    {/* Cell type selection */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-sm">Cell Type</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant={cellType === "wall" ? "default" : "outline"}
                          onClick={() => setCellType("wall")}
                          disabled={!editMode || simulationRunning}
                          className="justify-start"
                        >
                          <div className="w-4 h-4 bg-gray-800 mr-2 rounded-sm"></div>
                          Wall
                        </Button>
                        <Button
                          variant={cellType === "end" ? "default" : "outline"}
                          onClick={() => setCellType("end")}
                          disabled={!editMode || simulationRunning}
                          className="justify-start"
                        >
                          <div className="w-4 h-4 bg-red-500 mr-2 rounded-sm"></div>
                          End
                        </Button>
                      </div>
                    </div>

                    {/* Maze size */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">Maze Size</h3>
                        <span className="text-xs text-slate-500">
                          {mazeSize}×{mazeSize}
                        </span>
                      </div>
                      <Slider
                        value={[mazeSize]}
                        onValueChange={(value) => {
                          if (!simulationRunning) {
                            setMazeSize(value[0])
                            resetAction()
                            setMaze(generateMaze(value[0]))
                          }
                        }}
                        min={11}
                        max={31}
                        step={2}
                        disabled={simulationRunning}
                      />
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="default" className="gap-2" disabled={simulationRunning} onClick={newMazeAction}>
                        <RotateCcw className="w-4 h-4" />
                        New Maze
                      </Button>
                      <Button variant="outline" className="gap-2" disabled={simulationRunning} onClick={saveMazeAction}>
                        <Save className="w-4 h-4" />
                        Save Maze
                      </Button>
                    </div>

                    {/* Saved mazes */}
                    {customMazes.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-medium text-sm">Saved Mazes</h3>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {customMazes.map((savedMaze, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              className="w-full justify-between"
                              onClick={() => {
                                resetAction()
                                setMaze(savedMaze.maze)
                                setCurrentMazeName(savedMaze.name)
                              }}
                              disabled={simulationRunning}
                            >
                              {savedMaze.name}
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Legend */}
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="font-medium text-sm">Legend</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm bg-gray-800"></div>
                      <span className="text-sm text-slate-700">Wall</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm bg-white border border-gray-300"></div>
                      <span className="text-sm text-slate-700">Path</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm bg-yellow-400"></div>
                      <span className="text-sm text-slate-700">Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm bg-red-500"></div>
                      <span className="text-sm text-slate-700">Target</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm bg-green-400"></div>
                      <span className="text-sm text-slate-700">Solution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-sm bg-blue-200"></div>
                      <span className="text-sm text-slate-700">Visited</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-center border-t pt-4">
                <p className="text-xs text-center text-slate-500">
                  {editMode
                    ? "Click on cells to toggle walls or set the target"
                    : "Select an algorithm and click Run to solve the maze"}
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

