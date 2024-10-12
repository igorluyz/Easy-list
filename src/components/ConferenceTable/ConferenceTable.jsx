import React, { useEffect, useRef, useState } from 'react'
import './ConferenceTable.css'
import check from '../../assets/images/verifica.png'
import imagePDF from '../../assets/images/pdf.png'


// RESTA SOMENTE ADICIONAR O BUTTON DE LIMPAR GRIF
// ADICIONAR BUTTON DE IMPRIMIR PÁGINA DE CONFERÊNCIA

export const ConferenceTable = () => {

    const [shoppingList, setShoppingList] = useState(()=> {
        const savedItems = localStorage.getItem('shoppingList');
        return savedItems ? JSON.parse(savedItems) : [];
      });
    const [strikedItems, setStrikedItems] = useState(()=> {
        const savedItems = localStorage.getItem('itemsGrif');
        return savedItems ? JSON.parse(savedItems) : [];
    });

    const handleStrike = (id) => {
        if(strikedItems.includes(id)){
            setStrikedItems(strikedItems.filter(itemId => itemId !== id));
        }else{
            setStrikedItems([...strikedItems, id])
        }
    }

    const fileInputRef = useRef(null);

    const handleFileUpload = (evento)=> {
        const file = evento.target.files[0];
        const reader = new FileReader();
        reader.onload = (e)=> {
          const json = JSON.parse(e.target.result);
          setShoppingList(json);
        }
        reader.readAsText(file);
      }

      const handleReset = ()=> {
        setStrikedItems([]);
        if(fileInputRef.current){
          fileInputRef.current.value = "";
        }
      }

      useEffect(()=> {
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
      }, [shoppingList])

      useEffect(()=> {
        localStorage.setItem('itemsGrif', JSON.stringify(strikedItems));
      }, [strikedItems])


  return (
    <>
      <div className='button-functions-table-conference'>
      <button onClick={()=> {window.print()}} className='button-print'><img id='print-conference' src={imagePDF} alt="" /></button>
      <input id='input-conference' type="file" accept=".json" onChange={handleFileUpload} ref={fileInputRef} />
      <button onClick={handleReset} id='reset-grif-items'>Limpar riscado</button>
      </div>
     <div className="section-table-conference">
      <table id="table-to-print">
        <thead>
          <tr>
            <th>ID</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Fornecedor</th>
            <th>Status</th>
            {/* <th>Observação</th> */}
          </tr>
        </thead>

        <tbody>
          {shoppingList.map((item)=> (
            <tr key={item.countId} className={strikedItems.includes(item.countId) ? 'striked' : ''}>
              <td data-label='ID'>{item.countId}</td>
              <td data-label='Produto'>{item.productSelect}</td>
              <td data-label='Quantidade' id="quantityTable">{item.quantity}</td>
              <td data-label='Fornecedor'>{item.supplier}</td>
              <td>
                <button id='grife-button' onClick={()=> handleStrike(item.countId)}>
                    <img id='grife' src={check} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}
