// Конфигурация
const API_ENDPOINTS = {
    user: userUrl,
    admin: adminUrl
};

// DOM элементы
const DOM_SELECTORS = {
    headerUsername: '#headerUsername',
    headerRoles: '#headerRoles',
    tableBody: '#mainTable tbody'
};

// Утилиты
const formatRoles = roles =>
    roles?.map(role => role.role.replace("ROLE_", "")).join(' ') || '';

const createTableCell = content =>
    `<td><p>${content}</p></td>`;

// Обработка ошибок
const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    return null;
};

// API запросы
const fetchData = async (url, errorContext) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        return handleError(error, errorContext);
    }
};

// Отображение данных
const displayUserData = async () => {
    const user = await fetchData(API_ENDPOINTS.user, 'fetching user data');
    if (!user) return;

    const updateElement = (selector, content) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = content;
    };

    updateElement(DOM_SELECTORS.headerUsername, user.username);
    updateElement(DOM_SELECTORS.headerRoles, formatRoles(user.roles));
};

const renderUserTable = async () => {
    const users = await fetchData(API_ENDPOINTS.admin, 'fetching users table');
    if (!users) return;

    const tbody = document.querySelector(DOM_SELECTORS.tableBody);
    if (!tbody) return;

    const columns = ["id", "username", "surname", "age", "email", "roles"];

    tbody.innerHTML = users.map(user => {
        const cells = columns.map(col =>
            createTableCell(col === 'roles' ? formatRoles(user.roles) : user[col])
        ).join('');

        return `
      <tr>
        ${cells}
        <td>
          <a href="api/findUser/${user.id}" 
             class="btn btn-primary eBtn" 
             data-bs-toggle="modal" 
             data-bs-target="#exampleModal">
            Edit
          </a>
        </td>
        <td>
          <a href="api/findUser/${user.id}" 
             class="btn btn-danger deleteBtn" 
             data-bs-toggle="modal" 
             data-bs-target="#exampleModalDelete">
            Delete
          </a>
        </td>
      </tr>
    `;
    }).join('');
};

// Инициализация
const init = () => {
    document.addEventListener('DOMContentLoaded', () => {
        displayUserData();
        renderUserTable();
    });
};

init();