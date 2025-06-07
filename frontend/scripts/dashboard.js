let baseURL = 'https://localhost:7130/api/Chart/';

document.addEventListener('DOMContentLoaded', async function () {
  
    await fetchTopSellingProducts();
    await fetchSalesPerMonth();
    await fetchRevenuePerCategory();
    
});

const colorPalette = [
    "#4dc9f6", "#f67019", "#f53794", "#537bc4", "#acc236",
    "#166a8f", "#00a950", "#58595b", "#8549ba"
];

const fetchTopSellingProducts = async () => {
    try 
    {
        const response = await fetch(`${baseURL}top_selling_products`); 
        const data = await response.json();
        
        const labelName = data.map(item => item.productsName);
        const revenueValue = data.map(item => item.totalRevenue);

        const backgroundColors = data.map((_, index) => colorPalette[index % colorPalette.length]);

        new Chart("topSellingChart", {
            type: "bar",
            data: {
                labels: labelName,
                datasets: [{
                    data: revenueValue,
                    backgroundColor: backgroundColors,
                    borderColor: "#333",
                    borderWidth: 1
                }]
            },
            options: {
                legend: {display: false},
            }
        });
    } 
    catch (error) 
    {
        alert(`Error: ${error}`);
    }
}

const fetchSalesPerMonth = async () => {
    try 
    {
        const response = await fetch(`${baseURL}sales_per_month`); 
        const data = await response.json();
        
        const labelName = data.map(item => item.month);
        const revenueValue = data.map(item => item.revenue);

        new Chart("salePerMonth", {
            type: "line",
            data: {
                labels: labelName,
                datasets: [{
                    data: revenueValue,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                legend: {display: false},
            }
        });
    } 
    catch (error) 
    {
        alert(`Error: ${error}`);
    }
}

const fetchRevenuePerCategory = async () => {
    try 
    {
        const response = await fetch(`${baseURL}revenue_per_category`); 
        const data = await response.json();
        
        const labelName = data.map(item => item.category_name   );
        const revenueValue = data.map(item => item.total_revenue);

        const backgroundColors = data.map((_, index) => colorPalette[index % colorPalette.length]);

        new Chart("revPerCategory", {
            type: "pie",
            data: {
                labels: labelName,
                datasets: [{
                    data: revenueValue,
                    backgroundColor: backgroundColors,
                    borderColor: "#333",
                    borderWidth: 1
                }]
            },
            options: {
                legend: {display: true},
            }
        });
    } 
    catch (error) 
    {
        alert(`Error: ${error}`);
    }
}