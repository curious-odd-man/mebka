const MODAL_VISIBLE_CLASS = 'my-modal-visible';
const NEXT_PREV_BUTTON_CLASSES = ['carousel-control-next', 'carousel-control-next-icon', 'carousel-control-prev', 'carousel-control-prev-icon'];
// @ts-ignore
export function setUpModals() {
    const modalToggleButtons = document.querySelectorAll('button[data-local-toggle="modal"]');
    modalToggleButtons.forEach(button => {
        const targetId = button.getAttribute('data-local-target');
        const cleanId = targetId?.startsWith('#') ? targetId.slice(1) : targetId;
        const targetModal = document.getElementById(cleanId);
        button.addEventListener("click", event => {
            targetModal?.classList.add(MODAL_VISIBLE_CLASS);
            event.stopPropagation();
        });
    });
    window.onclick = function (event) {
        if (hasAnyClass(event.target, NEXT_PREV_BUTTON_CLASSES)) {
            console.log("Ignore close modal event, because clicked on navigation button");
        }
        else {
            const visibleModalElements = document.getElementsByClassName(MODAL_VISIBLE_CLASS);
            [...visibleModalElements].forEach(element => {
                element.classList.remove(MODAL_VISIBLE_CLASS);
            });
        }
    };
}
function hasAnyClass(element, classes) {
    return classes.some(function (c) {
        return element.classList.contains(c);
    });
}
