const board = [];
let width = 6;
let height = 8;
let bombCount = 10;
let firstOpenCount = 0;
let markStr = "bomb";
const numDict = {0:"zero",1:"one",2:"two",3:"three",4:"four",5:"five",6:"six",7:"seven",8:"eight"};
function initializeGame(w,h,bombs,firstOpen,mark="bomb"){
    width = Math.max(1,Math.min(50,Math.floor(w)));
    height = Math.max(1,Math.min(50,Math.floor(h)));
    const maxCells = width*height;
    bombCount = Math.max(0,Math.min(maxCells,Math.floor(bombs)));
    firstOpenCount = Math.max(0,Math.min(maxCells-bombCount,Math.floor(firstOpen)));
    markStr = (String(mark||"bomb")).trim()||"bomb";
    createBoard();
    placeBombs();
    calculateNumbers();
    openFirstCells();
}
function createBoard(){
    board.length = 0;
    for(let i=0;i<height;i++){
        board[i] = [];
        for(let j=0;j<width;j++){
            board[i][j] = {isOpen:false,isBomb:false,neighborCount:0};
        }
    }
}
function placeBombs(){
    const max = width*height;
    const target = Math.min(bombCount,max);
    let placed = 0;
    const indices = [];
    for(let i=0;i<max;i++) indices.push(i);
    for(let i=max-1;i>0 && placed<target;i--){
        const r = Math.floor(Math.random()*(i+1));
        const tmp = indices[i];
        indices[i] = indices[r];
        indices[r] = tmp;
    }
    for(let k=0;k<target;k++){
        const idx = indices[k];
        const r = Math.floor(idx/width);
        const c = idx%width;
        board[r][c].isBomb = true;
        placed++;
    }
}
function calculateNumbers(){
    for(let i=0;i<height;i++){
        for(let j=0;j<width;j++){
            let count = 0;
            for(let di=-1;di<=1;di++){
                for(let dj=-1;dj<=1;dj++){
                    if(di===0 && dj===0) continue;
                    const ni = i+di;
                    const nj = j+dj;
                    if(ni>=0 && ni<height && nj>=0 && nj<width && board[ni][nj].isBomb) count++;
                }
            }
            board[i][j].neighborCount = count;
        }
    }
}
function openFirstCells(){
    let opened = 0;
    const triesLimit = width*height*10;
    let tries = 0;
    while(opened<firstOpenCount && tries<triesLimit){
        const r = Math.floor(Math.random()*height);
        const c = Math.floor(Math.random()*width);
        if(!board[r][c].isOpen && !board[r][c].isBomb){
            openCell(r,c);
            opened++;
        }
        tries++;
    }
}
function openCell(r,c){
    if(r<0||r>=height||c<0||c>=width) return;
    if(board[r][c].isOpen) return;
    board[r][c].isOpen = true;
    if(board[r][c].isBomb) return;
    if(board[r][c].neighborCount===0){
        const stack = [[r,c]];
        while(stack.length){
            const [x,y] = stack.pop();
            for(let di=-1;di<=1;di++){
                for(let dj=-1;dj<=1;dj++){
                    const ni = x+di;
                    const nj = y+dj;
                    if(ni>=0 && ni<height && nj>=0 && nj<width && !board[ni][nj].isOpen && !board[ni][nj].isBomb){
                        board[ni][nj].isOpen = true;
                        if(board[ni][nj].neighborCount===0) stack.push([ni,nj]);
                    }
                }
            }
        }
    }
}
function renderBoardToMarkdown(){
    let out = `w×h : ${width}×${height} , Bombs : ${bombCount} , first open : ${firstOpenCount}\n`;
    for(let i=0;i<height;i++){
        let line = "";
        for(let j=0;j<width;j++){
            const cell = board[i][j];
            if(cell.isOpen){
                if(cell.isBomb) line += `:${markStr}:`;
                else {
                    const n = Math.max(0,Math.min(8,cell.neighborCount));
                    line += `:${numDict[n]}:`;
                }
            } else {
                if(cell.isBomb) line += `||:${markStr}:||`;
                else {
                    const n = Math.max(0,Math.min(8,cell.neighborCount));
                    line += `||:${numDict[n]}:||`;
                }
            }
        }
        out += line + "\n";
    }
    return out;
}
function renderBoardToDOM(){
    const markdown = renderBoardToMarkdown();
    const container = document.getElementById("gameBoard");
    if(!container) return;
    let pre = container.querySelector("pre");
    if(!pre){
        pre = document.createElement("pre");
        pre.style.whiteSpace = "pre-wrap";
        container.appendChild(pre);
    }
    pre.textContent = markdown;
}
document.addEventListener("DOMContentLoaded",()=>{
    const btn = document.getElementById("generateButton");
    if(!btn) return;
    btn.addEventListener("click",()=>{
        const w = parseInt(document.getElementById("width")?.value,10) || 6;
        const h = parseInt(document.getElementById("height")?.value,10) || 8;
        const b = parseInt(document.getElementById("bomb")?.value,10) || 10;
        const firstInput = parseInt(document.getElementById("first_open")?.value,10);
        const maxCells = w*h;
        const defaultFirst = Math.max(0,Math.floor((maxCells - Math.max(0,b))/4));
        const firstOpen = Number.isFinite(firstInput) ? Math.max(0,Math.min(firstInput,maxCells - Math.max(0,b))) : defaultFirst;
        const markInput = (document.getElementById("mark")?.value || "bomb").trim() || "bomb";
        initializeGame(w,h,b,firstOpen,markInput);
        renderBoardToDOM();
    });
});
window.initializeGame = initializeGame;
window.getBoard = ()=>board;