document.addEventListener('DOMContentLoaded', () => {
    const CONFIG = {
        ROLES: {
            ADMIN: { id: 1, authority: "ROLE_ADMIN", role: "ROLE_ADMIN" },
            USER: { id: 2, authority: "ROLE_USER", role: "ROLE_USER" }
        },
        API_URL: "/api/admin/",
        MODAL_SELECTORS: {
            edit: '#exampleModal',
            delete: '#exampleModalDelete'
        },
        TABLE_COLUMNS: ['id', 'username', 'surname', 'age', 'email', 'roles']
    };

    const DOM = {
        tableBody: document.querySelector('#mainTable tbody'),
        forms: {
            create: document.getElementById('createForm'),
            edit: document.getElementById('editForm'),
            delete: document.getElementById('deleteForm')
        },
        tabs: {
            home: document.getElementById('home-tab')
        }
    };

    const state = {
        currentRow: null,
        currentId: null
    };

    const utils = {
        formatRoles: roles => roles?.map(role => role.role.replace("ROLE_", "")).join(' ') || '',

        parseRoles: roleNames => roleNames?.map(name =>
            name === CONFIG.ROLES.ADMIN.role ? CONFIG.ROLES.ADMIN : CONFIG.ROLES.USER
        ) || [],

        getFormData: (form, prefix = '') => {
            const data = new FormData(form);
            return {
                ...Object.fromEntries(data),
                roles: utils.parseRoles($(`#${prefix}roles`).val())
            };
        },

        showModal: modalType => $(CONFIG.MODAL_SELECTORS[modalType]).showModal(),

        hideModal: modalType => {
            $(CONFIG.MODAL_SELECTORS[modalType]).hide();
            $('.modal-backdrop').hide();
        },

        resetForm: form => form.reset()
    };

    const api = {
        async deleteUser(id) {
            return this._fetch(`${CONFIG.API_URL}${id}`, 'DELETE');
        },

        async updateUser(id, data) {
            return this._fetch(`${CONFIG.API_URL}${id}`, 'PATCH', data);
        },

        async createUser(data) {
            return this._fetch(CONFIG.API_URL, 'POST', data);
        },

        async _fetch(url, method, data) {
            try {
                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: data ? JSON.stringify(data) : undefined
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error(`${method} request error:`, error);
                throw error;
            }
        }
    };

    const handlers = {
        setupEventDelegation() {
            document.addEventListener('click', this._handleTableClick.bind(this));
            DOM.forms.delete.addEventListener('submit', this.handleDeleteSubmit.bind(this));
            DOM.forms.edit.addEventListener('submit', this.handleEditSubmit.bind(this));
            DOM.forms.create.addEventListener('submit', this.handleCreateSubmit.bind(this));
        },

        _handleTableClick(e) {
            const row = e.target.closest('tr');
            if (!row) return;

            if (e.target.closest('.deleteBtn')) {
                this.handleDeleteClick(row);
            } else if (e.target.closest('.eBtn')) {
                this.handleEditClick(row);
            }
        },

        handleDeleteClick(row) {
            state.currentRow = row;
            state.currentId = row.cells[0].textContent;

            const rowData = this._getRowData(row);
            this._fillForm(DOM.forms.delete, rowData);
            utils.showModal('delete');
        },

        handleEditClick(row) {
            state.currentRow = row;
            state.currentId = row.cells[0].textContent;

            const rowData = this._getRowData(row);
            this._fillForm(DOM.forms.edit, rowData);
            DOM.forms.edit.password.value = '';
            utils.showModal('edit');
        },

        async handleDeleteSubmit(e) {
            e.preventDefault();
            try {
                await api.deleteUser(state.currentId);
                state.currentRow.remove();
                utils.hideModal('delete');
            } catch (error) {
                // Ошибка уже обработана в api._fetch
            }
        },

        async handleEditSubmit(e) {
            e.preventDefault();
            try {
                const userData = utils.getFormData(e.target, 'edit');
                const updatedUser = await api.updateUser(state.currentId, userData);
                this._updateRow(state.currentRow, updatedUser);
                utils.hideModal('edit');
            } catch (error) {
                // Ошибка уже обработана в api._fetch
            }
        },

        async handleCreateSubmit(e) {
            e.preventDefault();
            try {
                const userData = utils.getFormData(e.target);
                const newUser = await api.createUser(userData);
                this._addUserToTable(newUser);
                utils.resetForm(e.target);
                DOM.tabs.home.click();
            } catch (error) {
                // Ошибка уже обработана в api._fetch
            }
        },

        _getRowData(row) {
            return CONFIG.TABLE_COLUMNS.reduce((data, column, index) => {
                data[column] = row.cells[index].textContent;
                return data;
            }, {});
        },

        _fillForm(form, data) {
            Object.entries(data).forEach(([key, value]) => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) input.value = value;
            });
        },

        _updateRow(row, user) {
            CONFIG.TABLE_COLUMNS.forEach((column, index) => {
                row.cells[index].textContent = column === 'roles'
                    ? utils.formatRoles(user.roles)
                    : user[column];
            });
        },

        _addUserToTable(user) {
            const cells = CONFIG.TABLE_COLUMNS.map(column =>
                `<td>${column === 'roles' ? utils.formatRoles(user.roles) : user[column]}</td>`
            ).join('');

            const rowHtml = `
                <tr>
                    ${cells}
                    <td><button class="btn btn-primary eBtn">Edit</button></td>
                    <td><button class="btn btn-danger deleteBtn">Delete</button></td>
                </tr>
            `;

            DOM.tableBody.insertAdjacentHTML('beforeend', rowHtml);
        }
    };

    handlers.setupEventDelegation();
});