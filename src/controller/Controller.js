export function selectGroup(board, canvas, event, buttons) {
    
    const canvasRect = canvas.getBoundingClientRect();
    const elementRelativeX = event.clientX - canvasRect.left;
    const elementRelativeY = event.clientY - canvasRect.top;
    const x = elementRelativeX * canvas.width / canvasRect.width;
    const y = elementRelativeY * canvas.height / canvasRect.height;

    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].contains(x, y)) {
            board.select(board.groups[i]);   
            break;         
        }
    }
    if (board.selected) {
        if (board.selected.matches()) {
            board.selected.squaresInGroup[0].color = "white";
            board.selected.squaresInGroup[1].color = "white";
            board.selected.squaresInGroup[2].color = "white";
            board.selected.squaresInGroup[3].color = "white";
            board.selected = null;
        }
    }
}
export function rotateGroup(model, board, direction) {
        if (board.selected != null && board.selected.matches() != true) {
            board.selected.rotate(direction);
            model.numMoves++;
        }
}

