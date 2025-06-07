let baseURL = 'https://localhost:7130/api/';

let currentItem = null;
let currentMethod = null;
let dataTable = null;
let myTable = null;

document.addEventListener('DOMContentLoaded', function () {

    createTable();

    document.getElementById('btnAdd').addEventListener('click', function(e) {
        openModal(0, 'add');
    });

    document.getElementById('btnSubmit').addEventListener('click', function(e) {
        e.preventDefault();
        submitData(currentItem, currentMethod);
    });

    document.getElementById('btnCloseModal').addEventListener('click', function(e) {
        e.preventDefault();
        closeModal();
    });

});

const createTable = async () => {
    await fetchData();
    myTable = new DataTable('#itemTable', {
        columns: [
            { title: 'Name' },
            { title: 'Category' },
            { title: 'Unit' },
            { title: 'Stock Quantity' },
            { title: 'Price' },
            { title: 'Action' }
        ],
        data: dataTable.map(item => [
            item.products_name,
            item.products_category,
            item.products_unit,
            item.products_stock_quantity,
            item.products_price,
            `<a onclick="openModal(${item.products_id}, 'edit')" class="actionButtons btnEdit"><i class="fa-solid fa-pencil"></i></a>
             <a onclick="openModal(${item.products_id}, 'delete')" class="actionButtons btnDel"><i class="fa-solid fa-trash"></i></a>`
        ]),
        pageLength: 5,
        lengthMenu: [5, 10],
        paging: true,
        searching: true,
        scrollCollapse: true,
        scrollY: '500px',
        columnDefs: [
            { searchable: true, targets: 1 },
            { searchable: true, targets: 2 }
        ]
    });
};

const fetchData = async () => {
    return new Promise((resolve, reject) => {
        fetch(`${baseURL}Product`)
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

const openModal = async (id, method) => {
    currentMethod = null;
    currentItem = null;
    const modalPage = document.getElementById('modal');
    currentItem = id;
    currentMethod = method;
    parseInt(currentItem);

    if (method === 'edit')
    {
        document.getElementById('modalIdWrapper').style.display = 'flex';
        modalPage.style.display = 'flex';
        await populateSelect('Category', 'selectModalCategory', 'category');
        await populateSelect('Unit', 'selectModalUnit', 'unit');
        await getItemData(currentItem);
    }
    else if(method === 'add')
    {
        modalPage.style.display = 'flex';
        document.getElementById('modalIdWrapper').style.display = 'none';
        await populateSelect('Category', 'selectModalCategory', 'category');
        await populateSelect('Unit', 'selectModalUnit', 'unit');
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
                submitData(currentItem, 'delete');
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    }   
}

const refreshTable = async () => {
    try {
        await fetchData();
        
        myTable.clear();
        myTable.rows.add(dataTable.map(item => [
            item.products_name,
            item.products_category,
            item.products_unit,
            item.products_stock_quantity,
            item.products_price,
            `<a onclick="openModal(${item.products_id}, 'edit')" class="actionButtons btnEdit"><i class="fa-solid fa-pencil"></i></a>
             <a onclick="openModal(${item.products_id}, 'delete')" class="actionButtons btnDel"><i class="fa-solid fa-trash"></i></a>`
        ]));
        myTable.draw();
        console.log('Table refreshed successfully');
    } catch (error) {
        console.error('Error refreshing table:', error);
    }
};

const closeModal = async() => {
    const modalPage = document.getElementById('modal');
    modalPage.style.display = 'none';
    document.getElementById('modalId').value = '';
    document.getElementById('modalName').value = '';
    document.getElementById('selectModalCategory').value = '';
    document.getElementById('selectModalUnit').value = '';
    document.getElementById('modalPrice').value = '';
}

const getItemData = async (id) => {
    return new Promise((resolve, reject) => {
        fetch(`${baseURL}Product/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('modalId').value = data.products_id;
            document.getElementById('modalName').value = data.products_name;
            document.getElementById('selectModalCategory').value = data.products_category_id;
            document.getElementById('selectModalUnit').value = data.products_unit_id;
            document.getElementById('modalPrice').value = data.products_price;
            resolve();
        })
        .catch(err => {
            console.log('Error');
            reject();
        });
    })
}

const submitData = async (id, method) => {
    let url = '';
    let httpMethod = '';
    let bodyData = null;
    let includeHeaders = false;

    switch (method) {
        case 'add':
            url = `${baseURL}Product`;
            httpMethod = 'POST';
            includeHeaders = true;
            bodyData = {
                products_name: document.getElementById('modalName').value,
                products_category_id: parseInt(document.getElementById('selectModalCategory').value),
                products_unit_id: parseInt(document.getElementById('selectModalUnit').value),
                products_price: parseFloat(document.getElementById('modalPrice').value)
            };
            break;

        case 'edit':
            url = `${baseURL}Product/${id}`;
            httpMethod = 'PATCH';
            includeHeaders = true;
            bodyData = {
                products_name: document.getElementById('modalName').value,
                products_category_id: parseInt(document.getElementById('selectModalCategory').value),
                products_unit_id: parseInt(document.getElementById('selectModalUnit').value),
                products_price: parseFloat(document.getElementById('modalPrice').value)
            };
            break;

        case 'delete':
            url = `${baseURL}Product/${id}`;
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
        refreshTable();
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