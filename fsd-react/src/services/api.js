const API_BASE = window.location.protocol.startsWith('http') ? '' : 'http://localhost:3000'

export async function login({email,password}){
  try{
    const res = await fetch(API_BASE + '/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({email,password})
    })
    return await res.json()
  }catch(err){
    return { success:false, message: 'Network error' }
  }
}
