let baseURL = 'http://inventory-management-system.runasp.net/api/';

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
            { title: 'Type' },
            { title: 'Quantity' },
            { title: 'Notes' },
            { title: 'Date' },
            { title: 'Action' }
        ],
        data: dataTable.map(item => {

            const formattedDate = new Date(item.inventory_movement_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            });

            return [
                item.inventory_movement_product_name,
                item.inventory_movement_type,
                item.inventory_movement_quantity,
                item.inventory_movement_notes,
                formattedDate,
                `<a onclick="openModal(${item.inventory_movement_id}, 'edit')" class="actionButtons btnEdit"><i class="fa-solid fa-pencil"></i></a>`
            ]
        }),
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
        fetch(`${baseURL}InventoryMovement`)
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
        document.getElementById('productSpan').style.display = 'none';
        document.getElementById('productType').style.display = 'none';
        document.getElementById('productQty').style.display = 'none';
        document.getElementById('productNotes').style.display = 'flex';

        modalPage.style.display = 'flex';
        await getItemData(currentItem);
    }
    else if(method === 'add')
    {
        document.getElementById('modalIdWrapper').style.display = 'none';
        document.getElementById('productSpan').style.display = 'flex';
        document.getElementById('productType').style.display = 'flex';
        document.getElementById('productQty').style.display = 'flex';
        document.getElementById('productNotes').style.display = 'flex';
        modalPage.style.display = 'flex';

        await populateSelect('Product', 'selectModalProduct', 'products');
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
        myTable.rows.add(dataTable.map(item => {

            const formattedDate = new Date(item.inventory_movement_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            });
            
            return [
                item.inventory_movement_product_name,
                item.inventory_movement_type,
                item.inventory_movement_quantity,
                item.inventory_movement_notes,
                formattedDate,
                `<a onclick="openModal(${item.inventory_movement_id}, 'edit')" class="actionButtons btnEdit"><i class="fa-solid fa-pencil"></i></a>`
            ]
        }));
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
    document.getElementById('selectModalProduct').value = '';
    document.getElementById('selectModalType').value = '';
    document.getElementById('modalQty').value = '';
    document.getElementById('modalNote').value = '';
}

const getItemData = async (id) => {
    return new Promise((resolve, reject) => {   
        fetch(`${baseURL}InventoryMovement/${id}`)
        .then(res => res.json())
        .then(data => {
            console.log(
                `
                  MI ID: ${data.inventory_movement_id}
                  P ID: ${data.inventory_movement_product_id}
                  Note: ${data.inventory_movement_notes} 
                `);
            document.getElementById('modalId').value = data.inventory_movement_id;
            document.getElementById('selectModalProduct').value = data.inventory_movement_product_id;
            document.getElementById('selectModalType').value = data.inventory_movement_type;
            document.getElementById('modalQty').value = data.inventory_movement_quantity;
            document.getElementById('modalNote').value = data.inventory_movement_notes;
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
            url = `${baseURL}InventoryMovement`;
            httpMethod = 'POST';
            includeHeaders = true;
            bodyData = {
                inventory_movement_product_id: document.getElementById('selectModalProduct').value,
                inventory_movement_type: document.getElementById('selectModalType').value,
                inventory_movement_quantity: document.getElementById('modalQty').value,
                inventory_movement_notes: document.getElementById('modalNote').value
            };
            break;

        case 'edit':
            url = `${baseURL}InventoryMovement/${id}`;
            httpMethod = 'PATCH';
            includeHeaders = true;
            bodyData = {
                inventory_movement_notes: document.getElementById('modalNote').value
            };
            break;

        case 'delete':
            url = `${baseURL}InventoryMovement/${id}`;
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
            text: `Inventory ${method === 'add' ? 'added' : method === 'edit' ? 'updated' : 'deleted'} successfully!`,
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#4CAF50",
        }).showToast();

    } catch (err) {
        console.error("Error:", err);
        Toastify({
            text: `Error: Failed to ${method} Inventory.`,
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