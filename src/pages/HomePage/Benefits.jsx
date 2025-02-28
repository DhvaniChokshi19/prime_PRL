import React from 'react'
import benefit from "../../assets/benefits.png"

const Benefits = () => {
  return (
    <div className="flex justify-center w-full h-full">
      <div className="px-4 mb-3">
        <img src={benefit} alt="benefits" className="mx-auto" />
      </div>
    </div>
  )
}

export default Benefits;
