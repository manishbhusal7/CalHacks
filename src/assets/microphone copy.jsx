import React from 'react'

const Ripple = () => {
    return (
        <svg id="waves">
  <g stroke="white" strokewidth="1px" fill="transparent">
    <circle cx="50%" cy="50%" r="100">
      <animate attributeType="CSS" attributeName="opacity" from="0" to="1" dur="2s" repeatCount="indefinite" />
      <animate attributeType="CSS" attributeName="r" from="100" to="199.8" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="50%" cy="50%" r="200" >
      <animate attributeType="CSS" attributeName="r" from="200" to="299.8" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="50%" cy="50%" r="300" >
      <animate attributeType="CSS" attributeName="r" from="300" to="399.8" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="50%" cy="50%" r="400" >
      <animate attributeType="CSS" attributeName="r" from="400" to="499.8" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="50%" cy="50%" r="500" >
      <animate attributeType="CSS" attributeName="r" from="500" to="599.8" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="50%" cy="50%" r="600" >
      <animate attributeType="CSS" attributeName="opacity" from="1" to=".5" dur="2s" repeatCount="indefinite" />
      <animate attributeType="CSS" attributeName="r" from="600" to="699.8" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="50%" cy="50%" r="700" >
      <animate attributeType="CSS" attributeName="opacity" from=".5" to="0" dur="2s" repeatCount="indefinite" />
      <animate attributeType="CSS" attributeName="r" from="700" to="800" dur="2s" repeatCount="indefinite" />
    </circle>
  </g>
 </svg>
    )
}

export default Ripple