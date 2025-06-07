let baseURL = 'http://inventory-management-system.runasp.net/api/';

let currentItem = null;
let currentMethod = null;
let dataTable = null;
let myTable = null;
let myEntity = null;

document.addEventListener('DOMContentLoaded', function () {

    const toggleButtons = document.querySelectorAll("button[data-target]");

    toggleButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");
            const targetWrapper = document.getElementById(targetId);
            console.log(`Target: ${targetId}`, targetWrapper);

            if (targetWrapper) {
                const isVisible = targetWrapper.classList.contains("revealedWrapper");

                if (isVisible) {
                    const tableId = targetId === 'categoryTableWrapper' ? 'categoryTable' : 'unitTable';

                    const tableElement = document.getElementById(tableId);
                    
                    if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
                        $(`#${tableId}`).DataTable().destroy();
                        tableElement.innerHTML = '';
                    }

                    if(tableId === 'categoryTable') document.getElementById('btnAddCategory').style.display = 'none';
                    else if(tableId === 'unitTable') document.getElementById('btnAddUnit').style.display = 'none';

                    targetWrapper.classList.remove("revealedWrapper");

                } else {
                    if (targetId === 'categoryTableWrapper') {
                        dataTable = null;
                        createTable('category_', 'Category', 'categoryTable');
                        document.getElementById('btnAddCategory').style.display = 'flex';
                    } else if (targetId === 'unitTableWrapper') {
                        dataTable = null;
                        createTable('unit_', 'Unit', 'unitTable');
                        document.getElementById('btnAddUnit').style.display = 'flex';
                    }
                    targetWrapper.classList.add("revealedWrapper");
                }
            } else {
                console.warn(`No element found with id="${targetId}"`);
            }
        });
    });

    document.getElementById('btnAddUnit').addEventListener('click', function(e) {
        myEntity = ''
        myEntity = 'Unit';
        openModal(0, 'add', 'Unit', 'unit_');
    });

    document.getElementById('btnAddCategory').addEventListener('click', function(e) {
        myEntity = ''
        myEntity = 'Category';
        openModal(0, 'add', 'Category', 'category_');
    });

    document.getElementById('btnSubmit').addEventListener('click', function(e) {
        e.preventDefault();
        submitData(currentItem, currentMethod, myEntity);
    });

    document.getElementById('btnCloseModal').addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
    });

    document.addEventListener('click', function (e) {
        const editBtn = e.target.closest('.btnEdit');
        const deleteBtn = e.target.closest('.btnDel');

        if (editBtn) {
            myEntity = editBtn.dataset.entity;
            const id = editBtn.dataset.id;
            const root = editBtn.dataset.root;
            openModal(id, 'edit', myEntity, root);
            console.log(` Clicked ${myEntity}`);
        }

        if (deleteBtn) {
            myEntity = deleteBtn.dataset.entity;
            const id = deleteBtn.dataset.id;
            const root = deleteBtn.dataset.root;
            openModal(id, 'delete', myEntity, root);
            console.log(` Clicked ${myEntity}`);
        }
    });
});

const createTable = async (rootName, Entity, tableId) => {
    await fetchData(Entity);
    myTable = new DataTable(`#${tableId}`, {
        columns: [
            { title: `${rootName}name` },
            { title: `Action` },
        ],
        data: dataTable.map(item => [
            item[`${rootName}name`],
            `
            <button class="actionButtons btnEdit" 
                    data-id="${item[`${rootName}id`]}" 
                    data-type="edit" 
                    data-root="${rootName}"
                    data-entity="${Entity}">
                <i class="fa-solid fa-pencil"></i>
            </button>
            <button class="actionButtons btnDel" 
                    data-id="${item[`${rootName}id`]}" 
                    data-type="delete" 
                    data-root="${rootName}"
                    data-entity="${Entity}">
                <i class="fa-solid fa-trash"></i>
            </button>
            `
        ]),
        pageLength: 5,
        lengthMenu: [5],
        paging: true,
        searching: true,
        scrollCollapse: true,
        scrollY: '500px',
        columnDefs: [
            { searchable: true, targets: 1 }
        ]
    });
};

const fetchData = async (entity) => {
    return new Promise((resolve, reject) => {
        fetch(`${baseURL}${entity}`)
        .then((res) => res.json())
        .then((data) => {
            dataTable = data;
            resolve();
        })
        .catch((err) => {
            reject();
            console.error("Failed to fetch data", err)
        });
    });
};

let confirmListener = null;
let cancelListener = null;

const openModal = async (id, method, entity, rootName) => {
    currentMethod = null;
    currentItem = null;
    const modalPage = document.getElementById('modal');
    currentItem = id;
    currentMethod = method;
    parseInt(currentItem);

    if (method === 'edit')
    {
        document.getElementById('modalTitle').textContent = 'Edit';
        document.getElementById('modalIdWrapper').style.display = 'flex';
        modalPage.style.display = 'flex';
        await getItemData(currentItem, entity, rootName);
    }
    else if(method === 'add')
    {
        document.getElementById('modalTitle').textContent = 'Add';
        modalPage.style.display = 'flex';
        document.getElementById('modalIdWrapper').style.display = 'none';
    }
    else if(method === 'delete')
    {   
        Swal.fire({
            title: "Do you want to save the changes?",
            showCancelButton: true,
            confirmButtonText: "Save",
            confirmButtonColor: "#052f55",
            cancelButtonText: "Don't Save",
            cancelButtonColor: "#ff2727",
            background: "#d0e5ee"
        }).then((result) => {
            if (result.isConfirmed) {
                submitData(currentItem, 'delete', myEntity);
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    }   
}

const refreshTable = async (Entity, rootName, tableId) => {
    try {
        await fetchData(Entity);

        if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
            $(`#${tableId}`).DataTable().clear().destroy();
            document.getElementById(tableId).innerHTML = '';
        }

        myTable = new DataTable(`#${tableId}`, {
            columns: [
                { title: `${rootName}name` },
                { title: `Action` },
            ],
            data: dataTable.map(item => [
                item[`${rootName}name`],
                `
                <button class="actionButtons btnEdit" 
                        data-id="${item[`${rootName}id`]}" 
                        data-type="edit" 
                        data-root="${rootName}"
                        data-entity="${Entity}">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                <button class="actionButtons btnDel" 
                        data-id="${item[`${rootName}id`]}" 
                        data-type="delete" 
                        data-root="${rootName}"
                        data-entity="${Entity}">
                    <i class="fa-solid fa-trash"></i>
                </button>
                `
            ]),
            pageLength: 5,
            lengthMenu: [5],
            paging: true,
            searching: true,
            scrollCollapse: true,
            scrollY: '500px',
            columnDefs: [
                { searchable: true, targets: 1 }
            ]
        });

        console.log(`${Entity} table refreshed successfully`);
    } catch (error) {
        console.error('Error refreshing table:', error);
    }
}

const closeModal = async() => {
    const modalPage = document.getElementById('modal');
    modalPage.style.display = 'none';
}

const getItemData = async (id, Entity, rootName) => {
    return new Promise((resolve, reject) => {
        fetch(`${baseURL}${Entity}/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('modalId').value = data[`${rootName}id`];
            document.getElementById('modalName').value = data[`${rootName}name`];
            resolve();
        })
        .catch(err => {
            console.log('Error');
            reject();
        });
    })
}

const submitData = async (id, method, ent) => {
    let url = '';
    let httpMethod = '';
    let bodyData = null;
    let includeHeaders = false;

    switch (method) {
        case 'add':
            url = `${baseURL}${ent}`;
            httpMethod = 'POST';
            includeHeaders = true;
            if (ent === 'Category'){
                bodyData = {
                    category_name: document.getElementById('modalName').value
                };
            }else if (ent === 'Unit'){
                bodyData = {
                    unit_name: document.getElementById('modalName').value
                };
            }
            break;
        case 'edit':
            url = `${baseURL}${ent}/${id}`;
            httpMethod = 'PATCH';
            includeHeaders = true;
            if (ent === 'Category'){
                bodyData = {
                    category_name: document.getElementById('modalName').value
                };
            }else if (ent === 'Unit'){
                bodyData = {
                    unit_name: document.getElementById('modalName').value
                };
            }
            break;

        case 'delete':
            url = `${baseURL}${ent}/${id}`;
            httpMethod = 'DELETE';
            break;

        default:
            console.error("Unknown method:", method);
            return;
    }

    const fetchOptions = {
        method: httpMethod,
        ...(includeHeaders && { headers: { "Content-Type": "application/json" } }),
        ...(bodyData && { body: JSON.stringify(bodyData) })
    };

    try {
        const response = await fetch(url, fetchOptions);
        const data = httpMethod !== 'DELETE' ? await response.json() : null;
        console.log(`${method.toUpperCase()} successful:`, data);

        closeModal();
        await refreshTable(myEntity, myEntity.toLowerCase() + '_', myEntity.toLowerCase() + 'Table');
        Toastify({
            text: `Product ${method === 'add' ? 'added' : method === 'edit' ? 'updated' : 'deleted'} successfully!`,
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#4CAF50",
        }).showToast();

    } catch (err) {
        console.error("Error:", err);
        Toastify({
            text: `Error: Failed to ${method} product.`,
            duration: 2000,
            gravity: "top",
            position: "center",
            backgroundColor: "#F44336",
        }).showToast();
    }
};

const populateSelect = async (entity, selectTag, rootName) => {
    return new Promise((resolve, reject) => {
        fetch(`${baseURL}${entity}`)
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById(`${selectTag}`);
            select.innerHTML = `<option value="">-- Select ${rootName} --</option>`;

            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item[`${rootName}_id`];           
                option.textContent = item[`${rootName}_name`];
                select.appendChild(option);
            })
            resolve();
        })
        .catch(err => {
            console.error("Error:", err);
            reject();
        });
    })
}