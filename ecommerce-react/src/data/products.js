import axios from 'axios';
import { Cookie } from 'lucide-react';

const API_URL = 'https://localhost:4000';

// ✅ Optional local fallback
const fallbackProducts = [];
let isRetrying = false;
/**
 * Get products from a category or a specific product by ID
 * 
 * @param {boolean} isFiltered - Whether to filter by category
 * @param {boolean} isFeatured - Whether to get featured categories
 * @param {string} categoryId  - Category ID or 'all'
 * @param {number|string} productId - Optional: specific product ID to fetch
 * @returns {Promise<Array|Object>} - Array of products or single product object
 */
let categories = [];
export async function getCategories() {
  return categories;
}
const CACHE_KEY = "announcements_cache";
const CACHE_TIMESTAMP_KEY = "announcements_cache_timestamp";
const CACHE_DURATION_MS = 5 * 60 * 1000; 
const convertImageToBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Failed to convert image at ${url} to Base64:`, error);
    return url; // fallback to URL if failed
  }
};
const fetchToken = async () => {
  try {
    

    const res = await fetch('https://localhost:4000/api/session/getSessionToken', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Token fetch failed with status ${res.status}`);
    }

    const data = await res.json();
    if (!data.token) {
      throw new Error('Response missing token');
    }

    sessionStorage.setItem('session_token', data.token);
    sessionStorage.setItem('session_token_time', Date.now().toString());
  } catch (err) {
    console.error('Error fetching session token:', err);
    throw err; // Re-throw the error to propagate it to the calling function
  }
};



export const fetchAnnouncements = async (retryCount = 0) => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    const now = Date.now();

    if (cachedData && cachedData != '[]' && cachedTimestamp && now - parseInt(cachedTimestamp) < CACHE_DURATION_MS) {
      console.log("Cached data found", cachedData?.data);

      return JSON.parse(cachedData);
    }

    const response = await axios.get(`${API_URL}/api/announcements`);
    console.log(response.data?.data);
    const rawData = response.data?.data || [];

   
    const announcements = await Promise.all(
      rawData.map(async (item) => {
        const base64Photo = await convertImageToBase64(item.photo);
        return { ...item, photo: base64Photo };
      })
    );

    // Cache processed data
    localStorage.setItem(CACHE_KEY, JSON.stringify(announcements));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());

    return announcements;
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    if ((error.response?.status === 401 || error.response?.data?.session_expired) && retryCount < MAX_RETRIES) {
        await fetchToken(); // Ensure token is refreshed before retrying
        return fetchAnnouncements(retryCount + 1);
    }
    const fallbackCache = localStorage.getItem(CACHE_KEY);
    return fallbackCache ? JSON.parse(fallbackCache) : [];
  }
};
export async function logout() {
  try {
    console.log('Attempting logout request to https://localhost:4000/api/user/logout');
    const response = await axios.post('https://localhost:4000/api/user/logout', {}, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Response received:', response.status, response.statusText);
    if (response.status >= 200 && response.status < 300) {
      return { success: true };
    } else {
      throw new Error('Logout failed with status ' + response.status);
    }
  } catch (error) {
    console.error('Logout error details:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getuser(retryCount = 0) {
  try {
    const content = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      
      },
      //body: JSON.stringify({ google_id: googleId }),
      credentials: 'include',
      
    };
    
    console.log(content);
    
    const response = await fetch('https://localhost:4000/api/user/get-user', content);
    const data = await response.json();
    console.log(data);
    
    if ("session_expired" in data && retryCount < MAX_RETRIES) {
        await fetchToken(); // Ensure token is refreshed before retrying
        return getuser(retryCount + 1);
    }
    if (!response.ok) {
      throw new Error(data.message || 'Failed to log in');
    }

   
    const user = Array.isArray(data.data) && data.data.length > 0 ? data.data[0] : null;

    if (!user) {
      throw new Error('User data is empty');
    }
console.log(user);
content.method = 'GET'

    return {
      success: true,
      user,  
      endpoint: data.endpoint
    };
  } catch (error) {
    console.error('Login error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}
export async function getinfoord(endpt, retryCount = 0){
try {
  const content = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    
    },
    //body: JSON.stringify({ google_id: googleId }),
    credentials: 'include',
    
  };
  const infoorder =await fetch("https://localhost:4000/api/user" + endpt, content);
  if(infoorder.ok){
    const data = await infoorder.json();
    console.log(data);
    if ("session_expired" in data && retryCount < MAX_RETRIES) {
        await fetchToken(); // Ensure token is refreshed before retrying
        return getinfoord(endpt, retryCount + 1);
    }
    return data.data; // Assuming data structure is {status: "success", data: [...]} for orders
  }else{
    console.log(infoorder);
    return [];
  }
} catch (error) {
  console.error(error);
  return   [];
}



}
const _0x18ea1f=_0x9234;(function(_0x257a58,_0x27ac3f){const _0x1ac2f6=_0x9234,_0x49a3cb=_0x257a58();while(!![]){try{const _0x40f893=-parseInt(_0x1ac2f6(0x1ea))/0x1*(-parseInt(_0x1ac2f6(0x1e3))/0x2)+-parseInt(_0x1ac2f6(0x1e1))/0x3+-parseInt(_0x1ac2f6(0x1f0))/0x4*(-parseInt(_0x1ac2f6(0x1f5))/0x5)+-parseInt(_0x1ac2f6(0x1f1))/0x6*(parseInt(_0x1ac2f6(0x1f3))/0x7)+-parseInt(_0x1ac2f6(0x1e2))/0x8+-parseInt(_0x1ac2f6(0x1ed))/0x9*(-parseInt(_0x1ac2f6(0x1e4))/0xa)+parseInt(_0x1ac2f6(0x1e8))/0xb;if(_0x40f893===_0x27ac3f)break;else _0x49a3cb['push'](_0x49a3cb['shift']());}catch(_0x4fa662){_0x49a3cb['push'](_0x49a3cb['shift']());}}}(_0x73d3,0x77a37));function generateSecureToken(_0x12a0f4=_0x18ea1f(0x1f8),_0x40ddbb=_0x18ea1f(0x1f4)){const _0xdbc392=_0x18ea1f,_0x4fe776=Math[_0xdbc392(0x1ef)](Date['now']()/0x3e8),_0x31e91e=navigator[_0xdbc392(0x1e7)],_0x158ca4=Math[_0xdbc392(0x1e9)]()[_0xdbc392(0x1f7)](0x24)[_0xdbc392(0x1e6)](0x2,0xa),_0x2fce4a=_0x40ddbb+'|'+_0x4fe776+'|'+_0x31e91e+'|'+_0x12a0f4+'|'+_0x158ca4;let _0xe9cf20='';for(let _0x1c6e2d=0x0;_0x1c6e2d<_0x2fce4a[_0xdbc392(0x1eb)];_0x1c6e2d++){const _0x402261=_0x2fce4a[_0xdbc392(0x1e5)](_0x1c6e2d);_0xe9cf20+=String[_0xdbc392(0x1f2)]((_0x402261^0x2a)+_0x1c6e2d%0x5);}const _0x261afd=btoa(encodeURIComponent(_0xe9cf20))[_0xdbc392(0x1ee)]('')[_0xdbc392(0x1ec)]()[_0xdbc392(0x1f6)]('');return _0x261afd;}function _0x9234(_0x28632c,_0x9fee1a){const _0x73d3ed=_0x73d3();return _0x9234=function(_0x92345b,_0x5189e9){_0x92345b=_0x92345b-0x1e1;let _0x57ba84=_0x73d3ed[_0x92345b];return _0x57ba84;},_0x9234(_0x28632c,_0x9fee1a);}function _0x73d3(){const _0x23b0ad=['8660VqzrFe','60kOfyFp','fromCharCode','627277ldJrzT','super_secret_key','520wTUeXP','join','toString','/api/secure-endpoint','851136ADkmMn','7746368UtZCwM','1768982JNzAlY','2050QDobrr','charCodeAt','substring','userAgent','14145901ZFGYuV','random','1uUFoqx','length','reverse','10647FOLiIx','split','floor'];_0x73d3=function(){return _0x23b0ad;};return _0x73d3();}
(function(_0x47b2a8,_0x3c872b){const _0x347f30=_0x3de7,_0x48ab04=_0x47b2a8();while(!![]){try{const _0x172ed8=parseInt(_0x347f30(0x1db))/0x1+parseInt(_0x347f30(0x1dc))/0x2*(-parseInt(_0x347f30(0x1d9))/0x3)+-parseInt(_0x347f30(0x1d8))/0x4+parseInt(_0x347f30(0x1e1))/0x5+-parseInt(_0x347f30(0x1e2))/0x6*(parseInt(_0x347f30(0x1e5))/0x7)+parseInt(_0x347f30(0x1da))/0x8*(-parseInt(_0x347f30(0x1e0))/0x9)+parseInt(_0x347f30(0x1d7))/0xa;if(_0x172ed8===_0x3c872b)break;else _0x48ab04['push'](_0x48ab04['shift']());}catch(_0x2e8dfb){_0x48ab04['push'](_0x48ab04['shift']());}}}(_0xf6c3,0x96d27));function generateRequestToken(_0x315f64='s3cr3t'){const _0x5df470=_0x3de7,_0x17bb7f=Math[_0x5df470(0x1e4)](Date[_0x5df470(0x1df)]()/0x3e8),_0x1b1f70=_0x315f64+':'+_0x17bb7f,_0x54d1ed=btoa(_0x1b1f70),_0x4f169e=_0x54d1ed[_0x5df470(0x1dd)]('')[_0x5df470(0x1de)]((_0x3aa390,_0x5f1200)=>String['fromCharCode'](_0x3aa390[_0x5df470(0x1e6)](0x0)+_0x5f1200%0x5))[_0x5df470(0x1e3)]('');return _0x4f169e;}function _0x3de7(_0x114c56,_0x40274a){const _0xf6c3f9=_0xf6c3();return _0x3de7=function(_0x3de757,_0x1bea1b){_0x3de757=_0x3de757-0x1d7;let _0x37ca3b=_0xf6c3f9[_0x3de757];return _0x37ca3b;},_0x3de7(_0x114c56,_0x40274a);}function _0xf6c3(){const _0x3d01b9=['map','now','4072626uzPaRC','2828535JBVwaN','42sHxkFT','join','floor','292334CZFibE','charCodeAt','22290180gzjQgw','4923572rYIuCk','85971twbhib','8mawULp','457894IENpOm','46WPROjX','split'];_0xf6c3=function(){return _0x3d01b9;};return _0xf6c3();}
const MAX_RETRIES = 1;
export async function getProducts(isFiltered, isFeatured = false, categoryId = "all", productId = null, retryCount = 0) {
  const token = generateRequestToken();
 
    
    
  try {
    
    console.log(token);
    if (productId !== null) {
      // Fetch a specific product by ID
      try {
        const response = await axios.get(`${API_URL}/api/products/${productId}`,{headers: {
          'cf-turnstile-response': token,
          'x-secure-next': generateSecureToken(`/api/products/${productId}`),
          'x-session-token': sessionStorage.getItem('session_token'),
          'path':`/api/products/${productId}`
        }});
        console.log(response.data.data);
        return response.data.data;  // Assuming your API returns product in data.data
      } catch (error) {
        console.error("Error fetching specific product:", error);
        if (error.response?.data?.session_expired && retryCount < MAX_RETRIES) {
          await fetchToken();
          return getProducts(isFiltered, isFeatured, categoryId, productId, retryCount + 1);
        }
        return localStorage.getItem('products_all') ? localStorage.getItem('products_all') : [];
      }
   
    }

    if (isFeatured) {
      try {
            const response = await axios.get(`${API_URL}/api/products`, { headers: {
              'cf-turnstile-response': token,
              'x-secure-next': generateSecureToken('/api/products'),
              'x-session-token': sessionStorage.getItem('session_token'),              
              'path':`/api/products`
            } });
        
        console.log(response.data.data.products);
        const categories = response.data.data.products.map(product => product.category);
        const uniqueCategories = [...new Set(categories)];
        console.log(uniqueCategories);
        return {
          products: response.data.data.products,
          categories: uniqueCategories
        };
      } catch (error) {
        console.error("Error fetching featured products:", error);
        console.log("Error response:", error.response);
        if ((error.response?.status === 401 || error.response?.data?.session_expired) && retryCount < MAX_RETRIES) {
          await fetchToken();
          return getProducts(isFiltered, isFeatured, categoryId, productId, retryCount + 1);
        }
        return {
          products: [],
          categories: []
        };
      }
     
    }

    if (!isFiltered || categoryId === "all") {
      // This assumes you have an endpoint like /api/categories
      try {
        const allCategories = await axios.get(`${API_URL}/api/products`, { headers: {
          'cf-turnstile-response': token,
          'x-secure-next': generateSecureToken('/api/products'),
          'x-session-token': sessionStorage.getItem('session_token'),
          'path':`/api/products`
        } });

        const productsPromises = allCategories.data.data.map(cat =>
          axios.get(`${API_URL}/api/categories/${cat.id}/products`, { headers: {
            'cf-turnstile-response': token,
            'x-secure-next': generateSecureToken(`/api/categories/${cat.id}/products`),
            'x-session-token': sessionStorage.getItem('session_token'),        
            'path':`/api/categories/${cat.id}/products`
          } })
        );

        const responses = await Promise.all(productsPromises);

        const allProducts = responses.flatMap(r => r.data.data);
        return allProducts;
      } catch (error) {
        console.error("Error fetching all categories or products for all categories:", error);
        if (error.response?.data?.session_expired && retryCount < MAX_RETRIES) {
          await fetchToken();
          return getProducts(isFiltered, isFeatured, categoryId, productId, retryCount + 1);
        }
        return [];
      }
    }

    const response = await axios.get(`${API_URL}/api/categories/${categoryId}/products`, { headers: {
      'cf-turnstile-response': token,
      'x-secure-next':  generateSecureToken(`/api/categories/${categoryId}/products`),
      'x-session-token': sessionStorage.getItem('session_token'),
      'path':`/api/categories/${categoryId}/products`
    } });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    if (error.response?.data?.session_expired && retryCount < MAX_RETRIES) {
      await fetchToken(); 
      return getProducts(isFiltered, isFeatured, categoryId, productId, retryCount + 1);
    }
    return productId ? null : [];
  }
}

