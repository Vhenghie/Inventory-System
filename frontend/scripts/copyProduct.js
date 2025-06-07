let baseURL = 'https://localhost:7130/api/';

let currentItem = null;
let currentMethod = null;
let dataTable = null;

document.addEventListener('DOMContentLoaded', function () {

    createTable();

    
    Toastify({
            text: `Product ${method === 'add' ? 'added' : method === 'edit' ? 'updated' : 'deleted'} successfully!`,
            duration: 2000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "#4CAF50",
        }).showToast();
});

const createTable = async () => {
    await fetchData();
    new DataTable('#dataTable');
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

const openModal = async (id, method) => {
    currentMethod = null;
    currentItem = null;

    const modalPage = document.getElementById('modal');
    currentItem = id;

    if (method === 'edit')
    {
        modalPage.style.display = 'flex';
        await populateSelect('Category', 'selectModalCategory', 'category');
        await populateSelect('Unit', 'selectModalUnit', 'unit');
        await getItemData(id);
        currentMethod = 'edit'; 
    }
    else if(method === 'add')
    {
        modalPage.style.display = 'flex';
        await populateSelect('Category', 'selectModalCategory', 'category');
        await populateSelect('Unit', 'selectModalUnit', 'unit');
        currentMethod = 'add';
    }
    else
    {
        currentMethod = 'delete';
        submitData(currentItem, currentMethod);
    }
}   

const refreshTable = async () => {
    
};

const closeModal = async() => {
    const modalPage = document.getElementById('modal');
    modalPage.style.display = 'none';
}

const getItemData = async (id) => {
    return new Promise((resolve, reject) => {
        fetch(`${baseURL}Product/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('inputID').value = data.products_id;
            document.getElementById('inputName').value = data.products_name;
            document.getElementById('selectModalCategory').value = data.products_category_id;
            document.getElementById('selectModalUnit').value = data.products_unit_id;
            document.getElementById('inputPrice').value = data.products_price;
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
                products_name: document.getElementById('inputName').value,
                products_category_id: parseInt(document.getElementById('selectModalCategory').value),
                products_unit_id: parseInt(document.getElementById('selectModalUnit').value),
                products_price: parseFloat(document.getElementById('inputPrice').value)
            };
            break;

        case 'edit':
            url = `${baseURL}Product/${id}`;
            httpMethod = 'PATCH';
            includeHeaders = true;
            bodyData = {
                products_name: document.getElementById('inputName').value,
                products_category_id: parseInt(document.getElementById('selectModalCategory').value),
                products_unit_id: parseInt(document.getElementById('selectModalUnit').value),
                products_price: parseFloat(document.getElementById('inputPrice').value)
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

        await refreshTable();
        closeModal();

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