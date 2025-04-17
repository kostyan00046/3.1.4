
const DOM_ELEMENTS = {
    headerUser: '#headerUsername',
    headerRoles: '#headerRoles',
    tableBody: '#mainTable tbody'
};


const handleError = (error, context = '') => {
    console.error(`Ошибка ${context}:`, error);
    return null;
};


const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        return handleError(error, 'при получении данных');
    }
};


const formatRoles = (roles) => {
    return roles?.map(role => role.role.replace("ROLE_", "")).join(' ') || '';
};


const createTableCell = (content) => {
    const td = document.createElement('td');
    td.textContent = content;
    return td;
};


const displayUserData = async () => {
    const user = await fetchData(userUrl);
    if (!user) return;


    const updateHeader = (selector, content) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = content;
    };

    updateHeader(DOM_ELEMENTS.headerUser, user.username);
    updateHeader(DOM_ELEMENTS.headerRoles, formatRoles(user.roles));


    const tbody = document.querySelector(DOM_ELEMENTS.tableBody);
    if (!tbody) return;

    const tr = document.createElement('tr');
    const fields = ['id', 'username', 'surname', 'age', 'email'];

    fields.forEach(field => {
        tr.appendChild(createTableCell(user[field]));
    });

    tr.appendChild(createTableCell(formatRoles(user.roles)));
    tbody.appendChild(tr);
};


document.addEventListener('DOMContentLoaded', displayUserData);