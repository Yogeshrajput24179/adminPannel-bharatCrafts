import React, { useEffect,useState } from 'react'
import './List.css'
import { toast } from "react-toastify";
import axios from 'axios';

const List = ({url}) => {
  

  const [list,setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/products/list`);
    if(response.data.success){
      setList(response.data.data);
    }
    else{
      toast.error("error");
      
    }
  }
  const removeProduct = async (productId) => {
    if (!productId) {
        toast.error("❌ Invalid product ID");
        return;
    }

    try {
        console.log("🔹 Attempting to delete product with ID:", productId); // Debugging log

        const response = await axios.delete(`${url}/api/products/remove/${productId}`); // ✅ FIXED

        if (response.data.success) {
            toast.success("✅ Product removed successfully!");
            fetchList(); // Refresh product list
        } else {
            toast.error(response.data.message || "❌ Failed to remove product");
        }
    } catch (error) {
        console.error("❌ Remove product error:", error.response?.data || error);
        toast.error(error.response?.data?.message || "❌ Error removing product");
    }
};


  

  useEffect(()=>{
 fetchList()
  },[])
  return (
    <div>
         <div className="list add flex-col">
          <p>All Product List</p>
          <div className="list-table">
          <div className="list-table-format title">
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b>Action</b>

          </div>
          {list.map((item,index)=>{
            return(
              <div key={index} className="list-table-format">
                    <img src={`${url}/uploads/`+ item.image} alt={item.name} />
                    <p>{item.name}</p>
                    <p>{item.category}</p>
                    <p> ₹{item.price}</p>
                    <p className='removeProduct' onClick={()=>removeProduct(item._id)}>x</p>
              </div>
            )
          })}
          </div>
         
         </div>
    </div>
  )
}

export default List