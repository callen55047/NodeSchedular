import React, { useState } from 'react'

export default function PublicHome(props) {
  const imageStyle = {
    //backgroundImage: `url(${image})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className={"category-container"}>
      <div className={"category-head-back"} style={imageStyle}>
          <p>This is the public home</p>
      </div>
    </div>
        )
}