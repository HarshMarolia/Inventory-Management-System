"use client"
import Header from '@/components/Header'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState('')
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingaction, setLoadingaction] = useState(false)
  const [dropdown, setDropdown] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      let response = await fetch('/api/product')
      let rjson = await response.json()
      setProducts(rjson.products)
    }
    fetchProducts()
  }, [])

  const buttonAction = async (action, slug, initialQuantity) => {
    // changes in products
    let index = products.findIndex((item) => item.slug == slug);
    let newProducts = JSON.parse(JSON.stringify(products))
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts)
    // changes in dropdown
    let indexDrop = dropdown.findIndex((item) => item.slug == slug);
    let newDropdown = JSON.parse(JSON.stringify(dropdown))
    if (action == "plus") {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) + 1;
    } else {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) - 1;
    }
    setDropdown(newDropdown)
    // console.log(action, slug);
    setLoadingaction(true);
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, slug, initialQuantity }),
    });
    let r = await response.json();
    // console.log(r);
    setLoadingaction(false);
  }

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });
      if (response.ok) {
        console.log('Product added successfully');
        setAlert('Your Product has beed added successfully');
        setTimeout(() => {
          setAlert('');
        }, 5000);
        setProductForm({});
      } else {
        console.error('Error adding product');
      }
    } catch (error) {
      console.log('Error:', error);
    }
    let response = await fetch('/api/product')
    let rjson = await response.json()
    setProducts(rjson.products)
  }

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  }

  const onDropdownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length >= 3) {
      setLoading(true)
      setDropdown([])
      let response = await fetch('/api/search?query=' + query)
      let rjson = await response.json()
      setDropdown(rjson.products);
      setLoading(false)
    } else {
      setDropdown([]);
    }
  }

  return (
    <div className='mx-8'>
      <Header />
      <div className='text-green-500 text-center'>{alert}</div>
      {/* Display current stock */}
      <div className="container my-8 mx-auto">
        <h1 className="text-4xl font-semibold mb-8">Search a Product</h1>
        <div className="flex items-center">
          <input
            onChange={onDropdownEdit}
            type="text"
            placeholder="Enter product name"
            className="flex-grow border border-gray-300 rounded-l px-4 py-2 focus:outline-none focus:shadow-outline"
          />
          {/* <div className="relative inline-block">
            <select
              className="bg-white border border-gray-300 rounded-r px-4 py-2 focus:outline-none focus:shadow-outline"
            >
              <option value="all">All Categories</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
              <option value="category3">Category 3</option>
            </select>
          </div> */
          /* <button
            className="bg-blue-500 text-white rounded-r px-4 py-2 ml-2 hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          >
            Search
          </button> */}
        </div>
        {loading &&
          <div className='flex w-20 mx-auto h-20 text-center'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
              <circle fill="none" strokeWidth="2" strokeLinecap="round" cx="25" cy="25" r="20" stroke="black" style={{ opacity: 0.5 }} />
              <line fill="none" strokeWidth="2" strokeLinecap="round" x1="25" y1="25" x2="35" y2="25.1" stroke="black">
                <animateTransform attributeName="transform" dur="2s" type="rotate" from="0 25 25" to="360 25 25" repeatCount="indefinite" />
              </line>
              <line fill="none" strokeWidth="1.5" strokeLinecap="round" x1="25" y1="25" x2="24.5" y2="15" stroke="black">
                <animateTransform attributeName="transform" dur="1s" type="rotate" from="0 25 25" to="360 25 25" repeatCount="indefinite" />
              </line>
              <line fill="none" strokeWidth="1.5" strokeLinecap="round" x1="25" y1="25" x2="15" y2="24.5" stroke="black">
                <animateTransform attributeName="transform" dur="0.5s" type="rotate" from="0 25 25" to="360 25 25" repeatCount="indefinite" />
              </line>
            </svg>
          </div>}
        <div className="dropcontainer absolute w-[72vw] border border-1 bg-purple-100 rounded-md">

          {dropdown.map(item => {
            return <div key={item.slug} className='container flex justify-between p-2 my-1'>
              <span className="slug">{item.slug} ({item.quantity} available for ₹{item.price})</span>
              <div className='flex items-center align-baseline space-x-9'>
                <button disabled={loadingaction} onClick={() => { buttonAction("minus", item.slug, item.quantity) }} className="subtract px-4 py-2 bg-purple-500 text-white font-bold rounded-xl shadow-md cursor-pointer hover:bg-purple-600 transition-all disabled:bg-purple-200">-</button>
                <span className='quantity mx-3 inline-block w-3'>{item.quantity}</span>
                <button disabled={loadingaction} onClick={() => { buttonAction("plus", item.slug, item.quantity) }} className="add px-4 py-2 bg-purple-500 text-white font-bold rounded-xl shadow-md cursor-pointer hover:bg-purple-600 transition-all disabled:bg-purple-200">+</button>
              </div>
            </div>
          })}
        </div>
      </div>

      <div className="container my-8 mx-auto">
        <h1 className="text-4xl font-semibold mb-8">Add a Product</h1>
        <div className="container mx-auto mt-4">
          <form className="max-w-sm">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="productName">
                Product Slug
              </label>
              <input
                name='slug'
                value={productForm?.slug || ""}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="productName"
                type="text"
                placeholder="Enter product name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="quantity">
                Quantity
              </label>
              <input
                name='quantity'
                value={productForm?.quantity || ""}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="quantity"
                type="number"
                placeholder="Enter quantity"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="price">
                Price
              </label>
              <input
                name='price'
                value={productForm?.price || ""}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                type="number"
                step="0.01"
                placeholder="Enter price"
              />
            </div>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:shadow-outline transition-all"
              type="submit"
              onClick={addProduct}
            >
              Add Product
            </button>

          </form>
        </div>
      </div>
      <div className="container my-8 mx-auto">
        <h1 className="text-4xl font-semibold mb-8">Display Current Stock</h1>
        <div className="container mx-auto mt-4">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Product</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map(item => {
                return <tr className="bg-white" key={item._id}>
                  <td className="border border-gray-300 px-4 py-2">{item.slug}</td>
                  <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">₹{item.price}</td>
                </tr>
              })}

              {/* Add more rows for other products */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
