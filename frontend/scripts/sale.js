let baseURL = 'https://localhost:7130/api/';

let currentItem = null;
let currentMethod = null;
let dataTable = null;
let myTable = null;
let selectedProductPrice = 0;

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

    document.getElementById('selectModalProduct').addEventListener('change', function(e) {
        e.preventDefault();
        populateProductDetail(this.value);
    });

    document.getElementById('modalUnitQuantity').addEventListener('input', function(e) {
        e.preventDefault();
        
        document.getElementById('modalTotalPrice').value = parseInt(this.value) * document.getElementById('modalShowProdPrice').value;
    });

});

const createTable = async () => {
    await fetchData();

    myTable = new DataTable('#itemTable', {
        columns: [
            { title: 'Sale Description' },
            { title: 'Product' },
            { title: 'Price' },
            { title: 'Unit Value' },
            { title: 'Sales Price' },
            { title: 'Created' },
            { title: 'Action' }
        ],
        data: dataTable.map(item => {
            const formattedDate = new Date(item.sales_created).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            });
            
            return [
                item.sales_description,
                item.sales_product_name,
                item.sales_product_price,
                item.sales_unit_value,
                item.sales_total_price,
                formattedDate,
                `<a onclick="openModal(${item.sales_id}, 'edit')" class="actionButtons btnEdit"><i class="fa-solid fa-pencil"></i></a>`
                /*
                    `<a onclick="openModal(${item.sales_id}, 'edit')" class="actionButtons btnEdit"><i class="fa-solid fa-pencil"></i></a>
                    <a onclick="openModal(${item.sales_id}, 'delete')" class="actionButtons btnDel"><i class="fa-solid fa-trash"></i></a>`
                */
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
        fetch(`${baseURL}Sale`)
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
    parseInt(currentItem);

    currentMethod = method;

    if (method === 'edit')
    {
        document.getElementById('modalDescription').style.display = 'flex';
        document.getElementById('productSpan').style.display = 'none';
        document.getElementById('productDetailSpan').style.display = 'none';
        document.getElementById('qtySpan').style.display = 'none';
        document.getElementById('priceSpan').style.display = 'none';
        document.getElementById('modalIdWrapper').style.display = 'flex';
        document.getElementById('modalId').style.display = 'flex';
        modalPage.style.display = 'flex';
        await getItemData(currentItem);
    }
    else if(method === 'add')
    {
        document.getElementById('modalIdWrapper').style.display = 'none';
        document.getElementById('modalDescription').style.display = 'flex';
        document.getElementById('selectModalProduct').style.display = 'flex';
        document.getElementById('modalShowProdCategory').style.display = 'flex';
        document.getElementById('modalShowProdUnit').style.display = 'flex';
        document.getElementById('modalShowProdPrice').style.display = 'flex';
        document.getElementById('modalUnitQuantity').style.display = 'flex';
        document.getElementById('modalTotalPrice').style.display = 'flex';
        document.getElementById('productSpan').style.display = 'flex';
        document.getElementById('productDetailSpan').style.display = 'flex';
        document.getElementById('qtySpan').style.display = 'flex';
        document.getElementById('priceSpan').style.display = 'flex';
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

const resetModal = () => {
    document.getElementById('modalId').value = '';
    document.getElementById('modalDescription').value = '';
    document.getElementById('selectModalProduct').value = '';
    document.getElementById('modalShowProdCategory').value = '';
    document.getElementById('modalShowProdUnit').value = '';
    document.getElementById('modalShowProdPrice').value = '';
    document.getElementById('modalUnitQuantity').value = '';
    document.getElementById('modalTotalPrice').value = '';
}

const refreshTable = async () => {
    try {
        await fetchData();
        
        myTable.clear();
        myTable.rows.add(dataTable.map(item => {

            const formattedDate = new Date(item.sales_created).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            });
            
            return [
                item.sales_description,
                item.sales_product_name,
                item.sales_product_price,
                item.sales_unit_value,
                item.sales_total_price,
                formattedDate,
                `<a onclick="openModal(${item.sales_id}, 'edit')" class="actionButtons btnEdit"><i class="fa-solid fa-pencil"></i></a>`
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
    resetModal();
}

const getItemData = async (id) => {
    return new Promise((resolve, reject) => {
        fetch(`${baseURL}Sale/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('modalId').value = data.sales_id;
            document.getElementById('modalDescription').value = data.sales_description;
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
    let dataMsg = null;

    switch (method) {
        case 'add':
            url = `${baseURL}Sale`;
            httpMethod = 'POST';
            includeHeaders = true;
            bodyData = {
                sales_description: document.getElementById('modalDescription').value,
                sales_product_id: parseInt(document.getElementById('selectModalProduct').value),
                sales_unit_value: parseFloat(document.getElementById('modalUnitQuantity').value),
                sales_total_price: parseFloat(document.getElementById('modalTotalPrice').value)
            };
            break;

        case 'edit':
            url = `${baseURL}Sale/${id}`;
            httpMethod = 'PATCH';
            includeHeaders = true;
            bodyData = {
                sales_description: document.getElementById('modalDescription').value
            };
            break;

        case 'delete':
            url = `${baseURL}Sale/${id}`;
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

        if (!response.ok) {
            throw new Error(data?.error || data?.message || "An error occurred.");
        }

        closeModal();
        refreshTable();
        Toastify({
            text: `Sale ${method === 'add' ? 'added' : method === 'edit' ? 'updated' : 'deleted'} successfully!`,
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#4CAF50",
        }).showToast();

    } catch (err) {
        console.error("Error:", err);
        Toastify({
            text: `Error: Failed to ${method} sale.`,
            duration: 2000,
            gravity: "top",
            position: "center",
            backgroundColor: "#F44336",
        }).showToast();
    }
};

const populateProductDetail = (productId) => {
    return new Promise((resolve, reject) => {
        fetch(`${baseURL}Product/${productId}`)
        .then(res => res.json())
        .then(data => {
            selectedProductPrice = 0;
            document.getElementById('modalShowProdCategory').value = data.products_category;
            document.getElementById('modalShowProdUnit').value = data.products_unit;
            document.getElementById('modalShowProdPrice').value = data.products_price;
            document.getElementById('modalShowProdStock').value = data.products_stock_quantity;
            selectedProductPrice = data.products_price;
            resolve();
        })
        .catch(err => {
            console.log('Error');
            reject();
        });
    })
}

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