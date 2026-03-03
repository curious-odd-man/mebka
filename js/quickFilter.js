// @ts-ignore
export function setupQuickFilter(textFieldSelector, elements, criteriaFn) {
    const textField = document.querySelector(textFieldSelector);
    textField.addEventListener('input', () => {
        const value = textField.value.trim().toLowerCase();
        elements.forEach(element => {
            const shouldHide = criteriaFn(value, element);
            if (shouldHide) {
                element.style.display = 'none';
            }
            else {
                element.style.display = '';
            }
        });
    });
}
