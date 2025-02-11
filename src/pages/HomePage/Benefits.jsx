import React from 'react'
import benefit from "../../assets/benefits.png"

const Benefits = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-1/2 h-1/2">
        <img src={benefit} alt="benefits" className="mx-auto" />
      </div>
    </div>
  )
}

export default Benefits;
