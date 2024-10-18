// 将url中的查询参数转换为base64再
export const encodeQueryParamsToBase64 = (url: string)=>{
    // 解析 URL  
  const { hostname, pathname, search, hash } = new URL(url);  
  
  // 提取查询参数并转换为对象  
  const params = new URLSearchParams(search); 
  const queryParamsObject = {};  
  for (const [key, value] of params.entries()) {  
    queryParamsObject[key] = value;  
  }  
  
  // 将查询参数对象转换为字符串并进行 Base64 编码  
  const queryParamsString = JSON.stringify(queryParamsObject);  
  const base64EncodedParams = btoa(queryParamsString);  
  
  // 对 Base64 编码后的字符串进行 URL 编码，以确保它可以安全地作为 URL 的一部分  
  const encodedBase64Params = encodeURIComponent(base64EncodedParams);  
  
  // 构建新的 URL（这里假设我们将编码后的参数作为一个新的查询参数附加到 URL 上）  
  // 注意：这不是一个标准的做法，通常你不会将整个查询参数编码为 Base64 并作为单个参数传递  
  const newUrl = `${hostname}${pathname}?encodedParams=${encodedBase64Params}${hash}`;  
  
  return newUrl;  
}
// 示例用法  
const originalUrl = 'https://example.com/path?param1=value1&param2=value2';  
const newUrl = encodeQueryParamsToBase64(originalUrl);  
console.log(newUrl);