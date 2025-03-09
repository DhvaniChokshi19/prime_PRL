import React from 'react'

const Publication = () => {
  return (
    <div>
   <div className="flex justify-center space-x-4"> {/* Flexbox for side-by-side images */}
         <div className="Logo">
           <img src={prllogo} alt="PRL Logo"  />
         </div>
         <div className="Mainlogo">
           <img src={prlogo} alt="Main Logo" />
         </div>
       </div>
      <h1 className="text-4xl font-bold text-center">Publication</h1>
       </div>
  )
}

export default Publication