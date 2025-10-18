import axios from "axios";


const sendPost = async() => {
    const body = {
        name: "Divine",
        age: 21,
        status: "Single"
    }
  const response = await axios.post("https://jsonplaceholder.typicode.com/posts", body)
  console.log(response)
  return response.data;
    
}


(async () => {
  const result = await sendPost();
  console.log("✅ Response:", result);
})();