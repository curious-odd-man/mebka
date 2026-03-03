import { setupAddressAutocomplete } from "./f074c70953701d6e657717e5e87c7d17feccc3de.js";
const FIELDS = [];
// @ts-ignore
export function setupOrder(itemData) {
    FIELDS.length = 0;
    const currentItem = getCurrentItem(itemData);
    const termsOfUseCheckbox = document.getElementById("termsOfUseAcceptedCheckbox");
    termsOfUseCheckbox.addEventListener("click", () => {
        if (termsOfUseCheckbox.checked) {
            termsOfUseCheckbox.classList.remove('is-invalid');
        }
    });
    fillItemStaticContents(currentItem);
    setupDimensions(currentItem);
    setupFactorySection(currentItem);
    addAdditionalQuestions(currentItem.additionalQuestions);
    buttonShowSection('additional-changes-button', 'additional-changes-section', "Ludzu papildus izmaiņas:");
    buttonShowSection('additional-comments-button', 'additional-comments-section', "Komentāri:");
    buttonShowSection('delivery-button', 'delivery-section', "Lūdzu piegādi uz");
    setupAddressAutocomplete();
    doneAndEditButtons(currentItem, termsOfUseCheckbox);
    setupCopyToClipboard();
    setupMailtoLink(currentItem);
    const contactInfoSection = document.getElementById('contact-info-section');
    const contactInputs = contactInfoSection?.querySelectorAll('input');
    contactInputs.forEach(ci => {
        setupValidation(ci, 'input', i => i.value === '');
    });
    FIELDS.push((messageLines) => {
        if (termsOfUseCheckbox.checked) {
            messageLines.push("<br>Es izlasiju, sapratu un pieņemu lietošanas noteikumus un privātuma politiku.");
        }
    });
    FIELDS.push((messageLines) => {
        messageLines.push('<br>Cieņā,');
        contactInputs.forEach(ci => {
            messageLines.push(`<span class="text-primary">${ci.value}</span>`);
        });
    });
}
function addAdditionalQuestions(additionalQuestions) {
    if (additionalQuestions) {
        console.log("Adding additional questions " + additionalQuestions.length);
        const questionTemplate = document.getElementById('template-additional-question-checkbox');
        const parent = questionTemplate.parentElement;
        for (let i = 0; i < additionalQuestions.length; i++) {
            console.log("Adding question " + i);
            const question = additionalQuestions[i];
            const newQuestionElement = questionTemplate.content.firstElementChild.cloneNode(true);
            parent.appendChild(newQuestionElement);
            const checkbox = newQuestionElement.querySelector("#checkbox");
            const text = newQuestionElement.querySelector("#checkbox-label");
            const elaboration = newQuestionElement.querySelector("#elaboration");
            checkbox.id += i;
            text.id += i;
            elaboration.id += i;
            text.innerText = question.question;
            elaboration.innerText = question.elaboration;
            FIELDS.push(messageLines => {
                if (checkbox.checked) {
                    messageLines.push(`<span class="text-primary">${question.question}</span>`);
                }
            });
        }
    }
    else {
        console.log("No additional questions specified");
    }
}
function setupValidation(el, type, isValid) {
    function validate() {
        if (isValid(el)) {
            el.classList.add('is-invalid');
        }
        else {
            el.classList.remove('is-invalid');
        }
    }
    el.addEventListener(type, () => {
        validate();
    });
    validate();
}
function validateNotEmpty(input) {
    if (input.value === '') {
        input.classList.add('is-invalid');
    }
    else {
        input.classList.remove('is-invalid');
    }
}
function buttonShowSection(id, hiddenId, fieldText) {
    const button = document.getElementById(id);
    const hiddenSection = document.getElementById(hiddenId);
    button.addEventListener('click', () => {
        button.parentNode.removeChild(button);
        hiddenSection.hidden = false;
    });
    const inputs = hiddenSection.querySelectorAll('input, textarea');
    FIELDS.push(messageLines => {
        inputs.forEach(it => {
            let value = '';
            if (it instanceof HTMLInputElement) {
                value = it.value;
            }
            else if (it instanceof HTMLTextAreaElement) {
                value = it.value;
            }
            else if (it instanceof HTMLSelectElement) {
                value = it.value;
            }
            else {
                console.error(`Field does not have value for object ${it}`);
            }
            if (value) {
                messageLines.push(fieldText);
                messageLines.push(`<p class="text-primary">${value}</p>`);
            }
        });
    });
}
function switchSection() {
    const questionarySection = document.getElementById('questionary');
    const generatedSection = document.getElementById('generated');
    questionarySection.hidden = !questionarySection.hidden;
    generatedSection.hidden = !generatedSection.hidden;
}
function getDimensionsFromInputs(customDimensionsInputs) {
    return [...customDimensionsInputs]
        .map(it => {
        return it.ariaLabel + '=' + it.value;
    })
        .join(";");
}
function generateMessage(currentItem) {
    const messageContentsSection = document.getElementById('mail-contents');
    const itemName = currentItem.name;
    const messageLines = [
        'Labdien!<br>',
        `Es vēlos pasūtīt: <p class="text-primary">${itemName}</p>`,
    ];
    for (const field of FIELDS) {
        field(messageLines);
    }
    messageContentsSection.innerHTML = messageLines.join('<br>');
}
function addOption(select, value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.text = text;
    select.appendChild(option);
}
function createInputGroup(label) {
    const div = document.createElement('div');
    div.classList.add("input-group", "mb-3");
    const span = document.createElement('span');
    span.classList.add('input-group-text');
    span.innerText = label;
    const input = document.createElement('input');
    input.type = 'text';
    input.ariaLabel = label;
    input.classList.add('form-control');
    div.append(span, input);
    return div;
}
function doneAndEditButtons(currentItem, termsOfUseCheckbox) {
    const readyButton = document.getElementById('ready');
    readyButton.addEventListener('click', () => {
        if (termsOfUseCheckbox.checked) {
            switchSection();
            generateMessage(currentItem);
        }
        else {
            termsOfUseCheckbox.classList.add('is-invalid');
        }
    });
    const editButton = document.getElementById('edit');
    editButton.addEventListener('click', () => {
        switchSection();
    });
}
function setupCopyToClipboard() {
    const copyToClipboardButton = document.getElementById('copy-to-clipboard');
    copyToClipboardButton.addEventListener('click', () => {
        const messageContentsSection = document.getElementById('mail-contents');
        const text = messageContentsSection.innerText;
        navigator
            .clipboard
            .writeText(text)
            .then(() => {
            const buttonTextElement = document.getElementById("copy-to-clipboard-text");
            const originalText = buttonTextElement.innerText;
            buttonTextElement.innerText = 'Iekopēts!';
            setTimeout(() => {
                buttonTextElement.innerText = originalText;
            }, 2000);
        });
    });
}
function setupMailtoLink(currentItem) {
    const mailtoLink = document.getElementById('mailto-link');
    mailtoLink
        .addEventListener('click', e => {
        e.preventDefault();
        const recipient = mailtoLink.innerText;
        const subject = 'Pasūtījums ' + currentItem.name;
        const messageContentsSection = document.getElementById('mail-contents');
        const body = messageContentsSection.innerText;
        window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
}
function fillItemStaticContents(currentItem) {
    const itemNameSpan = document.getElementById('item-name-span');
    itemNameSpan.innerText = currentItem.name;
    const dimensionsImg = document.getElementById('dimensions-img');
    dimensionsImg.src = currentItem.imgPath;
}
function setupDimensions(currentItem) {
    const dimensionsSelector = document.getElementById('dimensions-select');
    currentItem.dimensions.forEach(dim => {
        const dimTextParts = [];
        for (const [i, value] of dim.split(',').entries()) {
            dimTextParts.push(`${currentItem.dimensionsNames[i]}=${value} (${currentItem.dimensionsUnits})`);
        }
        const dimText = dimTextParts.join('; ');
        addOption(dimensionsSelector, dimText, dimText);
    });
    addOption(dimensionsSelector, "custom", "Savs izmērs");
    const customDimensionsSectionCol = document.getElementById('custom-dimensions-section-col');
    currentItem.dimensionsNames.forEach(dimName => {
        const groupDiv = createInputGroup(dimName);
        customDimensionsSectionCol.appendChild(groupDiv);
    });
    const customDimensionsSection = document.getElementById('custom-dimensions-section-row');
    const customDimensionsInputs = customDimensionsSection.querySelectorAll('input');
    dimensionsSelector.addEventListener('change', () => {
        customDimensionsSection.hidden = dimensionsSelector.value !== 'custom';
    });
    customDimensionsInputs.forEach(input => {
        input.addEventListener('input', () => {
            validateNotEmpty(input);
        });
        validateNotEmpty(input);
    });
    FIELDS.push(messageLines => {
        const dimensions = dimensionsSelector.value === 'custom'
            ? getDimensionsFromInputs(customDimensionsInputs)
            : dimensionsSelector.value;
        messageLines.push(`Ar dimensijam:`, `<p class="text-primary">${dimensions}</p>`);
    });
}
function setupFactorySection(currentItem) {
    const factorySelect = document.getElementById('factory-select');
    const factoryCustomEntrySection = document.getElementById('factory-custom-input-section');
    factorySelect.addEventListener('change', () => {
        const isPredefined = factorySelect.selectedOptions[0].value !== 'custom';
        factoryCustomEntrySection.hidden = isPredefined;
    });
    const factoryCustomInput = document.getElementById('factory-custom-input');
    factoryCustomInput.addEventListener('input', () => {
        validateNotEmpty(factoryCustomInput);
    });
    validateNotEmpty(factoryCustomInput);
    const table = document.getElementById('materials-table');
    const addRowButton = document.getElementById('add-material-button');
    addRowButton.addEventListener('click', () => {
        createMaterialTableRow(undefined, table, true, factorySelect);
    });
    for (const material of currentItem.materials) {
        createMaterialTableRow(material, table, false, factorySelect);
    }
    FIELDS.push(messageLines => {
        const selectValue = factorySelect.selectedOptions[0].value;
        const factory = selectValue === 'custom' ? factoryCustomInput.value : selectValue;
        messageLines.push(`Detaļas pasūtīt no <span class="text-primary">${factory}</span>`);
    });
    FIELDS.push(messageLines => {
        messageLines.push(`Materiāli:`);
        const rows = table.tBodies[0].rows;
        for (let i = 0; i < rows.length; i++) {
            const rowElement = rows[i];
            const inputs = rowElement.querySelectorAll('input');
            messageLines.push(`<span class="text-primary">${inputs.item(2).value}: ${inputs.item(0).value}</span>`);
        }
    });
}
function getCurrentItem(itemData) {
    const paramsString = window.location.search;
    const searchParams = new URLSearchParams(paramsString);
    const itemId = searchParams.get('itemId');
    return itemData.find(it => it.index === itemId);
}
function createMaterialTableRow(material, table, isUserAddedRow, factorySelect) {
    const existingTableRows = [...table.rows];
    const lastRow = existingTableRows.length === 1 ? undefined : existingTableRows[existingTableRows.length - 1];
    const rowTemplate = document.getElementById('template-material-row');
    const newRow = rowTemplate.content.firstElementChild.cloneNode(true);
    table.tBodies.item(0).appendChild(newRow);
    const indexCell = newRow.cells.item(0);
    indexCell.innerText = `${lastRow ? parseInt(lastRow.cells.item(0).innerText) + 1 : 1}`;
    const materialIdCell = newRow.cells.item(1);
    const materialIdInput = materialIdCell.firstElementChild;
    const materialThicknessCell = newRow.cells.item(2);
    const materialThickness = materialThicknessCell.firstElementChild;
    const expectedThickness = material ? material.thickness : undefined;
    materialThickness.value = expectedThickness ? expectedThickness.toString() + ' mm' : '???';
    function processThickness(value, separator) {
        const actualThickness = value.split(separator).pop();
        materialThickness.classList.remove('is-invalid');
        if (!actualThickness) {
            materialThickness.value = '???';
            materialThickness.classList.add('is-invalid');
            return;
        }
        if (expectedThickness) {
            if (actualThickness !== expectedThickness?.toString()) {
                materialThickness.value = `Ir: ${actualThickness}. Vajag: (${expectedThickness}) mm.  `;
                materialThickness.classList.add('is-invalid');
            }
            else {
                materialThickness.value = actualThickness.toString() + ' mm';
            }
        }
        else {
            materialThickness.value = actualThickness.toString() + ' mm';
        }
    }
    setupValidation(materialIdInput, 'input', i => {
        const factoryName = factorySelect.value;
        const isEmpty = i.value === '';
        switch (factoryName) {
            case 'attelsr': {
                processThickness(i.value, '-');
                break;
            }
            case 'amf': {
                processThickness(i.value, '.');
                break;
            }
            default: {
                break;
            }
        }
        return isEmpty;
    });
    const descriptionCell = newRow.cells.item(3);
    const descriptionInput = descriptionCell.firstElementChild;
    descriptionInput.value = material ? material.description : '';
    setupValidation(descriptionInput, 'input', i => i.value === '');
    const deleteRowCell = newRow.cells.item(4);
    if (isUserAddedRow) {
        const deleteButtonTemplate = document.getElementById('template-delete-material-row');
        const deleteButton = deleteButtonTemplate.content.firstElementChild.cloneNode(true);
        deleteButton.addEventListener('click', () => {
            table.deleteRow(newRow.rowIndex);
        });
        deleteRowCell.appendChild(deleteButton);
    }
}
