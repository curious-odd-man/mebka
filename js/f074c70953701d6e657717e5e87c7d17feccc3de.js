let loadingIndicator;
let input;
let dropdown;
let dropdownOptions;
let debounceTimeout;
let loadingTimeout;
let currentRequestController; // To abort ongoing fetch
let currentPage = 1;
let query = '';
let hasMore = true;
let isLoading = false;
const LOADING_INDICATOR_TIMEOUT = 500;
const FETCH_TIMEOUT = 2000;
// @ts-ignore
export function setupAddressAutocomplete() {
    input = document.getElementById('address-input');
    dropdown = document.getElementById('address-dropdown');
    dropdownOptions = document.getElementById('address-dropdown-options-list');
    loadingIndicator = document.getElementById('address-dropdown-loading-indicator');
    input.addEventListener('input', () => {
        clearTimeout(debounceTimeout);
        clearTimeout(loadingTimeout);
        hideLoading();
        currentPage = 1;
        hasMore = true;
        query = input.value.trim();
        if (query === '') {
            hideDropdown();
            return;
        }
        clearDropdown();
        loadingTimeout = displayLoadingAfterSecond();
        debounceTimeout = setTimeout(() => {
            fetchAndShowOptions(query, currentPage);
        }, FETCH_TIMEOUT);
    });
    dropdownOptions.addEventListener('scroll', () => {
        if (!hasMore || isLoading) {
            return;
        }
        const { scrollTop, scrollHeight, clientHeight } = dropdownOptions;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            currentPage += 1;
            displayLoading();
            fetchAndShowOptions(query, currentPage);
        }
    });
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== input) {
            hideDropdown();
        }
    });
}
function fetchAndShowOptions(searchTerm, page = 1) {
    if (currentRequestController) {
        currentRequestController.abort();
    }
    currentRequestController = new AbortController();
    const signal = currentRequestController.signal;
    const url = `https://mans.pasts.lv/api/public/addresses/ais?search=${encodeURIComponent(searchTerm)}&page=${page}`;
    fetch(url, { signal })
        .then(response => response.json())
        .then(data => extractFromData(data))
        .then(options => {
        if (page === 1) {
            clearDropdown();
        }
        options.options.forEach(option => {
            const li = document.createElement('li');
            li.textContent = option.label;
            li.classList.add("dropdown-item");
            li.addEventListener('click', () => {
                input.value = li.textContent;
                hideDropdown();
            });
            dropdownOptions.insertBefore(li, loadingIndicator);
        });
        hasMore = options.hasMore;
        hideLoading();
    })
        .catch(err => {
        if (err.name === 'AbortError') {
            return;
        }
        console.error('Fetch error:', err);
        hideLoading();
    });
}
function extractFromData(data) {
    if (data['@context'] === '\/api\/contexts\/Ais'
        && data['@id'] === "\/api\/addresses\/ais"
        && data["@type"] === "hydra:Collection") {
        const members = data['hydra:member'];
        const view = data['hydra:view'];
        const currPage = getPageFromLink(view['@id']);
        const lastPage = getPageFromLink(view['hydra:last']);
        const options = [];
        members.forEach(m => {
            const addr = m['readableAddress'];
            options.push({
                label: addr,
                value: addr
            });
        });
        return {
            hasMore: currPage !== lastPage,
            options: options
        };
    }
    return {
        hasMore: false,
        options: []
    };
}
function getPageFromLink(text) {
    const i = text.indexOf('?');
    const params = text.substring(i + 1);
    const searchParams = new URLSearchParams(params);
    return searchParams.get('page');
}
function showDropdown() {
    dropdown.style.display = 'block';
}
function hideDropdown() {
    dropdown.style.display = 'none';
}
function displayLoadingAfterSecond() {
    clearTimeout(loadingTimeout);
    return setTimeout(() => {
        displayLoading();
    }, LOADING_INDICATOR_TIMEOUT);
}
function displayLoading() {
    isLoading = true;
    showDropdown();
    loadingIndicator.style.display = 'block';
}
function hideLoading() {
    isLoading = false;
    clearTimeout(loadingTimeout);
    loadingIndicator.style.display = 'none';
}
function clearDropdown() {
    const listItems = dropdownOptions.querySelectorAll('li');
    if (listItems.length > 1) {
        for (let i = 0; i < listItems.length - 1; i++) {
            dropdownOptions.removeChild(listItems[i]);
        }
    }
}
