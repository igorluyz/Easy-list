import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

export const Home = () => {
  return (
    <>
    <div className="button-container">
      <Link to="/listProducts">
        <button className="shopping-button">Acessar App EasyList</button>
      </Link>
      {/* <Link to="/underDevelopment">
        <button className="development-button">Página em desenvolvimento</button>
      </Link> */}
      <Link to='/conference'>
        <button className='conference-button'>Acessar Página de Conferência</button>
      </Link>
    </div>
    </>
  )
}
