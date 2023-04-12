// import React, { useEffect, useState } from 'react'
// import '../CSS/Scheduler.css'
// // import userAPI from '../api/userAPI'

// let connected = false
// export default function Scheduler() {
//   const [isConnected, setIsconnected] = useState(false);
//   const token = localStorage.getItem('jwttoken')
//   // const headers = {
//   //   Authorization: `${token}`,
//   //   'Content-Type': 'application/json'
//   // };
//   useEffect(()=>{
//     setIsconnected(connected)
//   },[])
// const authorize = async () => {

  

//   fetch('http://localhost:2000/auth', {
//     headers: {
//       Authorization:localStorage.getItem('jwttoken')
//     }
//   })
//   .then(response => response.json())
//   .then(data => {
//     const { url } = data;
//     window.location.href = url;
//     connected=true;
//   })
//   .catch(error => console.error(error));

// }


//    if(isConnected){return(
//     <>
//         <div className="cardHolder">
//         <div className="card">
//         {/* <a href="http://localhost:2000/auth">     */}
//         <div className="button" onClick={authorize} >Schedule Tweets</div>
//         {/* <a href="http://localhost:2000/tweet">    
//         <div className="button">Make Tweet</div></a> */}
//         </div>
//         </div>
//     </>
//   )}else{return(<>
//        <div className="cardHolder">
//         <div className="card">
//         {/* <a href="http://localhost:2000/auth">     */}
        
//         <div className="button" onClick={authorize} >Connect Your Account</div>  
//         {/* <a href="http://localhost:2000/tweet">    
//         <div className="button">Make Tweet</div></a> */}
//         </div>
//         </div>
//   </>)}
// }


import React, { useEffect, useState } from 'react'
import '../CSS/Scheduler.css'
// import userAPI from '../api/userAPI'

export default function Scheduler() {
  const [isConnected, setIsConnected] = useState(false);
  const [isScheduled, setIsScheduled] = useState('')
  const token = localStorage.getItem('jwttoken');



  const storedIsConnected = localStorage.getItem('isConnected');
  console.log(storedIsConnected)

  useEffect(() => {
    if (storedIsConnected) {
      setIsConnected(storedIsConnected === 'true');
    }
  }, []);

  const authorize = async () => {
    fetch('http://localhost:2000/auth', {
      headers: {
        Authorization: token
      }
    })
    .then(response => response.json())
    .then(data => {
      const { url } = data;
      window.location.href = url;
      localStorage.setItem('isConnected', true);
      setIsConnected(true);
    })
    .catch(error => console.error(error));
    
  }

  const schedule = async () => {
    console.log(token)
    await fetch('http://localhost:2000/tweet', {
      headers: {
        Authorization: token
      }
    })
    .then(response => response.json())
    .then(data => {
      setIsScheduled(data.msg)
    })
    .catch(error => console.error(error));


  }

  return (
    <>
      <div >
        
          {setIsConnected? (
            <div className="cardHolder">
            <span>You have sccessfully connected your Account..!</span>
            <div className="card"> 
            <div className="button" onClick={schedule}>Schedule Tweets</div>
             <span>{isScheduled}</span> 
            </div>
            </div>
          ) : (
            <div className="cardHolder">
            <div className="card">
            <div className="button" onClick={authorize}>Connect Account</div>
            </div>
            </div>
          )}
         
      </div>
    </>
  );
}
