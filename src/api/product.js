const API_BASE_URL =
  "https://catalog-management-system-dev-ak3ogf6zea-uc.a.run.app/cms/products";

// Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    const data = await response.json();
    console.log(data); // Debugging log to check the structure

    if (Array.isArray(data.products)) {
      return data.products; // Correctly accessing the products array
    } else {
      console.error("Products is not an array:", data);
      return []; // Return an empty array to prevent map() errors
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Fetch product details by ID
export const fetchProductDetails = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product details: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};
