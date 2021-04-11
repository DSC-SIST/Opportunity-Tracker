import cookie from "js-cookie";

// methods to save token and user data in cookies and local storage to use them in future 

// save the cookie
export const setCookie = (key,value) => {
     if (window !== 'undefined'){
         cookie.set(key,value, {
             expires: 1
         });
     }
}

// remove from cookie
export const removeCookie = key => {
     if (window !== 'undefined'){
         cookie.remove(key, {
             expires: 1
         });
     }
}

// get data from cookie such as stored token
// will be useful when we ake request to server with token
export const getCookie = key => {
     if (window !== 'undefined'){
         return cookie.get(key)
     }
}

// save in local storage
export const setLocalStorage = (key,value) => {
     if (window !== 'undefined'){
         localStorage.setItem(key,JSON.stringify(value))
     }
}


// remove from local storage
export const removeLocalStorage = key => {
     if (window !== 'undefined'){
         localStorage.removeItem(key)
     }
}


//authenticate user by passing data to cookie and local during signin
// next callback funtion works like an middleware
export const authenticate = (response,next)=> {
    setCookie('token', response.data.token);
    setLocalStorage('user', response.data.user);

    next();
}


// access user info fron local storage
export const isAuth = ()=>{ 
    if (window != 'undefined'){
        const cookieChecked = getCookie('token');
        
        if(cookieChecked){
            const user = localStorage.getItem('user');
            if(user){
                return JSON.parse(user)
            }
        }
    }
    
};


// singout user
export const signout = next=>{
    removeCookie('token');
    removeLocalStorage('user');

    next();
}