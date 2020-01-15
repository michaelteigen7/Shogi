const boardKey = 'board';

function saveBoard(board) {
    const localStorage = window.localStorage;
    try {
      localStorage.setItem(boardKey, JSON.stringify(board));
      return true;
    }
    catch(e) {
      return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        (localStorage && localStorage.length !== 0);
    }
}

function loadBoard() {
  const localStorage = window.localStorage;
  const savedBoard = JSON.parse(localStorage.getItem(boardKey));
  if(!savedBoard) {
    console.error("Error in loading board!");
  } else {
    return savedBoard;
  }
}

export { saveBoard, loadBoard };