import React, { useState } from 'react'
import "./FormShopping.css"

export const FormShopping = () => {

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');

  const envioDeDados = async (evento) => {
    evento.preventDefault();
    // LÓGICA DE ENVIO DE DADOS
    const formDados = {productName, quantity, supplier};
    
    try{
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDados),
      });
      console.log("Produto cadastrado com sucesso, status: ", response.status)
      if(response.status === 201){
        alert("Produto Cadastrado com sucesso")
      }
    }catch (error){
      console.error("Erro de conexão", error)
    }
  }


  return (
    <>
    <form className="shopping-list-form" onSubmit={envioDeDados}>
      <h2>Shopping List</h2>
      
      <div className="form-group">
        <label htmlFor="productName">Nome do Produto</label>
        <input 
          type="text" 
          id="productName" 
          value={productName} 
          onChange={(e) => setProductName(e.target.value)} 
          placeholder="Digite o nome do produto"
          required 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="quantity">Quantidade</label>
        <input 
          type="text" 
          id="quantity" 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
          placeholder="Digite a quantidade" 
          required 
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="supplier">Fornecedor</label>
        <input 
          type="text" 
          id="supplier" 
          value={supplier} 
          onChange={(e) => setSupplier(e.target.value)} 
          placeholder="Digite o nome do fornecedor" 
          required 
        />
      </div>

      <button type="submit" className="submit-button">Adicionar à lista</button>
    </form>
    </>
  )
}
