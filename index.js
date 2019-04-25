const canvas = document.getElementById("myCanvas")
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight
const ctx = canvas.getContext('2d')

const rows = 30
const oneWidth = canvas.width / rows
const cols = rows
const oneHeight = canvas.height / cols

const gridTypes = {
    "WALL" : "WALL",
    "START" : "START",
    "END" : "END",
    "NULL" : "NULL",
    "OPENLIST" : "OPENLIST",
    "PATH" : "PATH",
}

const mouseEventTypes = {
    "LEFT" : 1,
    "RIGHT" : 3,
}

let mouseLeftPressed
let mouseX
let isPickedStartNode
let isPickedEndNode
let mouseY

let grid

function init(){
    mouseLeftPressed = false
    mouseX = 1
    mouseY = 1
    isPickedStartNode = false
    isPickedEndNode = false
    grid = createGrid(rows, cols)
}

init()

grid[14][4].type = gridTypes.START
let startNode = grid[0][0]
grid[14][24].type = gridTypes.END
let endNode = grid[19][19]

myCanvas.addEventListener("mousemove", (e) => {
    mouseX = e.offsetX
    mouseY = e.offsetY
})

document.oncontextmenu = (e) => {
    e.preventDefault()
}

document.addEventListener("mousedown", (e) => {
    if(e.which === mouseEventTypes.RIGHT){
        // right click
    }
    if(e.which === mouseEventTypes.LEFT){
        // left click
        mouseLeftPressed = true
    }
})

document.addEventListener("mouseup", (e) => {
    if(e.which === mouseEventTypes.LEFT){
        mouseLeftPressed = false
    }
})

document.getElementById("btnStart").addEventListener("click", () => {
    solution()
})

function draw(){
    //draw grid
    for(let row = 0; row < grid.length; row++){
        for(let col = 0; col < grid[0].length; col++){
            switch(grid[row][col].type){
                case gridTypes.WALL:
                ctx.fillStyle = "#808080"
                break
                case gridTypes.NULL:
                ctx.fillStyle = "white"
                break
                case gridTypes.START:
                ctx.fillStyle = "#C30103"
                break
                case gridTypes.END:
                ctx.fillStyle = "#0077CC"
                break
                case gridTypes.OPENLIST:
                ctx.fillStyle = "#38B049"
                break
            }
            if(grid[row][col].isClosed === true && grid[row][col].type !== gridTypes.START){
                ctx.fillStyle = "#AFEEEE"
            }
            if(grid[row][col].type === gridTypes.PATH){
                ctx.fillStyle = "#FFD300"
            }
            ctx.fillRect(col * oneWidth, row * oneHeight, oneWidth, oneHeight)
            if(grid[row][col].type !== gridTypes.WALL){
                ctx.fillStyle = "black"
                ctx.font = oneWidth/5 + "px Arial"
                ctx.fillText(grid[row][col].g, + 3 +  col * oneWidth, row * oneHeight + oneWidth/5)
                const hTextWidth = ctx.measureText(grid[row][col].h).width
                ctx.fillText(grid[row][col].h, - 3 + (col + 1) * oneWidth - hTextWidth, row * oneHeight + oneWidth/5)
                ctx.font = oneWidth/4 + "px Arial"
                const fTextWidth = ctx.measureText(grid[row][col].f).width
                ctx.fillText(grid[row][col].f, col * oneWidth + oneWidth / 2 - fTextWidth / 2, row * oneHeight + oneHeight)
            }
        }
    }
    //draw row line
    for(let row = 0; row < rows; row++){
        ctx.beginPath()
        ctx.fillStyle = "black"
        ctx.moveTo(0, canvas.height / rows * row)
        ctx.lineTo(canvas.width, canvas.height / rows * row)
        ctx.stroke()
        ctx.closePath()
    }
    //draw col line
    for(let col = 0; col < cols; col++){
        ctx.beginPath()
        ctx.fillStyle = "black"
        ctx.moveTo(canvas.width / cols * col,  0)
        ctx.lineTo(canvas.width / cols * col, canvas.height)
        ctx.stroke()
        ctx.closePath()
    }
    //draw pickedStart,End Node
    if(isPickedStartNode || isPickedEndNode){
        for(let row = 0; row < rows; row++){
            for(let col = 0; col < cols; col++){
                const startX = col * oneWidth
                const endX = (col + 1) * oneWidth
                const startY = row * oneHeight
                const endY = (row + 1) * oneHeight
                if(
                    mouseX >= startX &&
                    mouseX < endX &&
                    mouseY >= startY &&
                    mouseY < endY
                ){
                    if(isPickedStartNode){
                        ctx.fillStyle = "#C30103"
                    } else if(isPickedEndNode){
                        ctx.fillStyle = "#0077CC"
                    }
                    ctx.fillRect(col * oneWidth, row * oneHeight, oneWidth, oneHeight)
                }
            }
        }
    }
}

function update(){
    if(mouseLeftPressed === true){
        for(let row = 0; row < rows; row++){
            for(let col = 0; col < cols; col++){
                const startX = col * oneWidth
                const endX = (col + 1) * oneWidth
                const startY = row * oneHeight
                const endY = (row + 1) * oneHeight
                if(
                    mouseX >= startX &&
                    mouseX < endX &&
                    mouseY >= startY &&
                    mouseY < endY
                ){
                    if(isPickedStartNode === true){
                        grid[row][col].type = gridTypes.START
                        mouseLeftPressed = false
                        isPickedStartNode = false
                    } else if(isPickedEndNode === true){
                        grid[row][col].type = gridTypes.END
                        mouseLeftPressed = false
                        isPickedEndNode = false
                    } else {
                        const { type } = grid[row][col]
                        if(type === gridTypes.START){
                            grid[row][col].type = gridTypes.NULL
                            isPickedStartNode = true
                            mouseLeftPressed = false
                        } else if(type === gridTypes.END){
                            grid[row][col].type = gridTypes.NULL
                            isPickedEndNode = true
                            mouseLeftPressed = false   
                        } else {
                            grid[row][col].type = gridTypes.WALL
                        }
                    }
                }
            }
        }
    }
}

function loop(){
    draw()
    update()
    requestAnimationFrame(loop)
}

loop()

async function solution(){
    let startNode
    let endNode
    let breakSwitch = false
    for(let row = 0; row < rows; row++){
        if(breakSwitch === true){ break }
        for(let col = 0; col < cols; col++){
            if(startNode && endNode){
                breakSwitch = true
                break
            }
            if(grid[row][col].type === gridTypes.START){
                startNode = grid[row][col]
            } else if(grid[row][col].type === gridTypes.END){
                endNode = grid[row][col]
            }
        }
    }

    const openList = [startNode]
    for(let i = 0; true; i++){
        await timer(2)
        
        // endNode 찾음
        if(endNode.isVisited === true){
            let nodeSp = []
            let node = endNode
            nodeSp.push(node)
            while(node.parentIndex !== null){
                node = node.parentIndex
                nodeSp.push(node)
            }
            nodeSp.forEach((node, value) => {
                if(value === 0){
                    grid[node.row][node.col].type = gridTypes.END
                }
                if(node.type !== gridTypes.START && node.type !== gridTypes.END){
                    grid[node.row][node.col].type = gridTypes.PATH
                }
            })
            break
        }

        //openList 중 최소 F Node 찾아서 current Node 지정
        const currentNode = openList.reduce((previousNode, currentNode) => {
            if(previousNode === null){
                if(currentNode.isClosed === false){
                    return currentNode
                }
            } else {
                if(currentNode.isClosed === false && currentNode.f < previousNode.f){
                    return currentNode
                }
            }
            return previousNode
        }, null)

        // mark isClosed
        currentNode.isClosed = true 

        // 인접노드 탐색
        const adjacentNodes = findAdjacentNodes(currentNode)
        // 인접노드 업데이트
        adjacentNodes.forEach((adjacentNode) => {
            const { node, cost } = adjacentNode
            if(node.isClosed === false){
                if(node.isVisited === true){
                    //compare g cost
                    const prev_g_cost = node.g
                    const next_g_cost = currentNode.g + cost
                    if(next_g_cost < prev_g_cost){
                        //update parent, g, f
                        node.parentIndex = currentNode
                        node.g = next_g_cost
                        node.f = node.h + node.g
                    }
                } else {
                    openList.push(node)
                    node.type = gridTypes.OPENLIST
                    node.parentIndex = currentNode
                    node.g = currentNode.g + cost
                    node.h = calculateHeuristicPath(node, endNode, [])
                    node.f = node.h + node.g
                    node.isVisited = true
                }
            }
        })
    }
}

function calculateHeuristicPath(startNode, endNode, prevPathSp){
    const pathSp = prevPathSp
    if(startNode.row === endNode.row && startNode.col === endNode.col){
        //arrival

        //calculate total cost
        const totalCost = pathSp.reduce((totalCost, path) => {
            return totalCost + path.cost
        }, 0)
        return totalCost
    } else {
        //not arrival
        let dRow = 0 
        let dCol = 0
        let cost = 0
        if(startNode.row !== endNode.row && startNode.col !== endNode.col){
            //row, col 둘다 불일치 ===> 대각선이동 cost : 14
            cost = 14
            dRow = startNode.row > endNode.row ? -1 : 1
            dCol = startNode.col > endNode.col ? -1 : 1
        } else {
            //row or col 하나만 불일치 ===> 수평 or 수직이동 cost : 10
            cost = 10
            if(startNode.row !== endNode.row){
                dRow = startNode.row > endNode.row ? -1 : 1
            }
            if(startNode.col !== endNode.col){
                dCol = startNode.col > endNode.col ? -1 : 1
            }
        }

        const nextRow = startNode.row + dRow
        const nextCol = startNode.col + dCol
        pathSp.push({
            cost,
            row : nextRow,
            col : nextCol,
        })
        const newStartNode = {
            row : nextRow,
            col : nextCol,
        }
        return calculateHeuristicPath(newStartNode, endNode, pathSp)
    }
}

function isValidRowCol(row, col){
    return (
        row >= 0 &&
        row < rows &&
        col >= 0 &&
        col < cols
    )
}

function isValidDiagonal(currentNode, dRow, dCol){
    const one = grid[currentNode.row + dRow][currentNode.col]
    const two = grid[currentNode.row][currentNode.col + dCol]
    if(one.type === gridTypes.WALL && two.type === gridTypes.WALL){
        //this is blocked diagonal path
        return false
    }
    return true
}

function findAdjacentNodes(currentNode){
    const adjacentNodes = []
    //↖
    row = currentNode.row - 1
    col = currentNode.col - 1
    if(
        isValidRowCol(row, col) && 
        isValidDiagonal(currentNode, -1, -1) &&
        grid[row][col].isClosed === false && ( grid[row][col].type === gridTypes.NULL || grid[row][col].type === gridTypes.END || grid[row][col].type === gridTypes.OPENLIST)){
        adjacentNodes.push({
            node : grid[row][col],
            cost : 14
        })
    }
    //↗
    row = currentNode.row - 1
    col = currentNode.col + 1
    if(isValidRowCol(row, col) && 
    isValidDiagonal(currentNode, -1, + 1) &&
    grid[row][col].isClosed === false && ( grid[row][col].type === gridTypes.NULL || grid[row][col].type === gridTypes.END || grid[row][col].type === gridTypes.OPENLIST)){
        adjacentNodes.push({
            node : grid[row][col],
            cost : 14
        })
    }
    //↙
    row = currentNode.row + 1
    col = currentNode.col - 1
    if(isValidRowCol(row, col) && 
    isValidDiagonal(currentNode, +1, -1) &&
    grid[row][col].isClosed === false && ( grid[row][col].type === gridTypes.NULL || grid[row][col].type === gridTypes.END || grid[row][col].type === gridTypes.OPENLIST)){
        adjacentNodes.push({
            node : grid[row][col],
            cost : 14
        })
    }
    //↘
    row = currentNode.row + 1
    col = currentNode.col + 1
    if(isValidRowCol(row, col) && 
    isValidDiagonal(currentNode, +1, +1) &&
    grid[row][col].isClosed === false && ( grid[row][col].type === gridTypes.NULL || grid[row][col].type === gridTypes.END || grid[row][col].type === gridTypes.OPENLIST)){
        adjacentNodes.push({
            node : grid[row][col],
            cost : 14
        })
    }
    //→
    row = currentNode.row
    col = currentNode.col + 1
    if(isValidRowCol(row, col) && grid[row][col].isClosed === false && ( grid[row][col].type === gridTypes.NULL || grid[row][col].type === gridTypes.END || grid[row][col].type === gridTypes.OPENLIST)){
        adjacentNodes.push({
            node : grid[row][col],
            cost : 10
        })
    }
    //←
    row = currentNode.row
    col = currentNode.col - 1
    if(isValidRowCol(row, col) && grid[row][col].isClosed === false && ( grid[row][col].type === gridTypes.NULL || grid[row][col].type === gridTypes.END || grid[row][col].type === gridTypes.OPENLIST)){
        adjacentNodes.push({
            node : grid[row][col],
            cost : 10
        })
    }
    //↑
    row = currentNode.row - 1
    col = currentNode.col
    if(isValidRowCol(row, col) && grid[row][col].isClosed === false && ( grid[row][col].type === gridTypes.NULL || grid[row][col].type === gridTypes.END || grid[row][col].type === gridTypes.OPENLIST)){
        adjacentNodes.push({
            node : grid[row][col],
            cost : 10
        })
    }
    //↓
    row = currentNode.row + 1
    col = currentNode.col
    if(isValidRowCol(row, col) && grid[row][col].isClosed === false && ( grid[row][col].type === gridTypes.NULL || grid[row][col].type === gridTypes.END || grid[row][col].type === gridTypes.OPENLIST)){
        adjacentNodes.push({
            node : grid[row][col],
            cost : 10
        })
    }
    return adjacentNodes
}

function timer(ms){
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

function createGrid(rows, cols){
    let index = 0
    const grid = []
    for(let row = 0; row < rows; row++){
        grid[row] = []
        for(let col = 0; col < cols; col++){
            grid[row][col] = {
                type : gridTypes.NULL,
                row,
                col,
                g : 00,
                h : 00,
                f : 00,
                index : index,
                isVisited : false,
                isClosed : false,
                parentIndex : null,
            }
            index ++
        }
    }
    return grid    
}