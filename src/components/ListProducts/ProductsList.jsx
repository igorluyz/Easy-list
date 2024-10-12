import { useEffect, useRef, useState } from "react"
import './ProductsList.css'
import jsPDF from "jspdf";
import 'jspdf-autotable';
import imagePDF from '../../assets/images/pdf.png'
import editButton from '../../assets/images/edit.png'
import deletButton from '../../assets/images/delet.png'
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa o CSS padrão
import './CustomConfirmAlert.css'; // Importa o CSS personalizado
import {AiOutlineWarning} from 'react-icons/ai';

export const ProductsList = () => {
    const [productsList, setProductsList] = useState([]);

    // A FORMA CORRETA DE RECUPERAR UM ESTADO DO LOCAL STORAGE
    const [shoppingList, setShoppingList] = useState(()=> {
      const savedItems = localStorage.getItem('shoppingList');
      return savedItems ? JSON.parse(savedItems) : [];
    });
    const [productSelect, setProductSelect] = useState('');
    const [quantity, setQuantity] = useState('');
    const [supplier, setSupplier] = useState('');

    const [editingProduct, setEditingProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false)
    let [countId, setCountId] = useState(()=> {
      const saveCount = localStorage.getItem('countID');
      try{
        return saveCount !== null ? JSON.parse(saveCount) : 0;
      }catch {
        return 0;
      }
    });
    const [status, setStatus] = useState('');
    const fileInputRef = useRef(null);


    const editingProductSelect = (product) => {
      setEditingProduct(product)
      setIsModalOpen(true)
      console.log(product)
    }

    function saveEditProduct(){
      setShoppingList(prevList => prevList.map(item => item.countId === editingProduct.countId ? editingProduct : item));
      // setEditingProduct(null)
      setIsModalOpen(false)
    }


    async function fetchProducts(){
      const response = await fetch('/api/product');
      const productsEmJson = await response.json()
      
      // Ordenando Produtos
      const ordenedProducts = productsEmJson.sort((a, b) => {
        return a.productName.localeCompare(b.productName, 'pt-BR');
      });
      setProductsList(ordenedProducts);
    };
    
    useEffect(()=> {
      fetchProducts();
    }, [])

    const resetForm = ()=> {
      setProductSelect('');
      setQuantity('');
      setSupplier('');
    }

    function deleteProduct(idProductRemove){
      // CONCEITO TOP DEMAIS DE SETSTATE
      setShoppingList(prevList => prevList.filter(item => item.countId !== idProductRemove))
      // setIdProduct(idProduct - 1)
    }

    function handleCount (){
      setCountId(prevCount => prevCount + 1);
    }

    const envioDeDados = (evento) => {
      evento.preventDefault();
      const formDados = {productSelect, quantity, supplier, countId}
      shoppingList.push(formDados);
      localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
      // setCountId(prevCount => prevCount + 1)
      localStorage.setItem('countID', JSON.stringify(countId));
      setStatus('Item Adicionado');
      resetForm();
    }

    useEffect(()=> {
      localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    }, [shoppingList])

    const hiddenStatus = () => {
      setTimeout(()=> {

        setStatus('')
      }, 5000)
    }

    function handleResetTable(){
      confirmAlert({
        customUI: ({onClose}) => {
          return (
          <div className='custom-confirm-alert'>
            <AiOutlineWarning size={50} color="#fbbc05" />
            <h1>Confirmação</h1>
            <p>Você tem certeza que deseja limpar a tabela?</p>
            <div className="buttons">
              <button onClick={onClose}>Não</button>
              <button
                onClick={() => {
                  setShoppingList([]);
                  onClose();
                }}
              >
                Sim
              </button>
            </div>
          </div>
          )
        }
      });
      if(fileInputRef.current){
        fileInputRef.current.value = "";
      }
      // setCountId(0);
      // localStorage.setItem('countID', JSON.stringify(countId));
    }

    function printTablePDF(){
      // Dados da tabela
      const columns = [
      { title: 'ID', dataKey: 'idProduct' },
      { title: 'Produto', dataKey: 'productSelect' },
      { title: 'Quantidade', dataKey: 'quantity' },
      { title: 'Fornecedor', dataKey: 'supplier' }
       ];

       const rows = shoppingList.map(item => ({
        idProduct: item.countId,
        productSelect: item.productSelect,
        quantity: item.quantity,
        supplier: item.supplier
      }));

      const pdf = new jsPDF({
        orientation: 'landscape', // ou 'portrait' para modo retrato
        unit: 'mm',
        format: 'a4' // A4
      });

      pdf.autoTable({
        head: [columns.map(col => col.title)],
        body: rows,
        columns: columns,
        margin: { top: 20 },
        theme: 'striped',
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255]
        },
        footStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255]
        }
      });
      pdf.save('listadecompras.pdf')
    }

    const downloadJSON = (data, filename) => {
      const jsonStr = JSON.stringify(data);
      const blob = new Blob([jsonStr], {type: 'application/json'});
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = filename + '.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    const handleDownload = ()=> {
      downloadJSON(shoppingList, 'listaBackup');
      if(fileInputRef.current){
        fileInputRef.current.value = "";
      }
    }

    const handleFileUpload = (evento)=> {
      const file = evento.target.files[0];
      const reader = new FileReader();
      reader.onload = (e)=> {
        const json = JSON.parse(e.target.result);
        setShoppingList(json);
      }
      reader.readAsText(file);
    }

    
  return (
    <>
    <form onSubmit={envioDeDados} onReset={resetForm} onChange={hiddenStatus}>
      <label>
        Selecione um produto:
        <input list="products" value={productSelect} onChange={(e) => setProductSelect(e.target.value.toUpperCase())} required />
      </label>

      <label>
        Digite a quantidade a ser comprada:
        <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value.toUpperCase())} required/>
      </label>

      <label>
        Digite o nome do fornecedor/local:
        <input list="suppliers" type="text" value={supplier} onChange={(e) => setSupplier(e.target.value.toUpperCase())}/>
      </label>

      <button type="submit" onClick={handleCount}>Adicionar Produto</button>
      <button type="reset">Limpar</button>

      <p id="status-form">{status}</p>
    </form>

    <div className="button-functions-table">
      <button id="imprimir" onClick={printTablePDF}><img id="img-pdf-imp" src={imagePDF} alt="" /></button>

      <button onClick={handleResetTable}>Limpar Tabela</button>

      <button id="button-download-json" onClick={handleDownload}>Salvar Lista</button>
      <input type="file" accept=".json" onChange={handleFileUpload} ref={fileInputRef}/>
    </div>


    <datalist id="products">
    {productsList.map((products)=> (<option key={products._id} value={products.productName}></option>))}
    </datalist>

    <datalist id="suppliers">
      <option value="SEU ERONILDES">SEU ERONILDES</option>
      <option value="JOSA">JOSA</option>
      <option value="GOMES">GOMES</option>
      <option value="ZE LUCIO">ZE LUCIO</option>
      <option value="NATAL/RN DIVERSOS">NATAL/RN DIVERSOS</option>
      <option value="FEIRA">FEIRA</option>
      <option value="FREEZER CARNES">FREEZER CARNES</option>
      <option value="SADIA">SADIA</option>
      <option value="OUTROS/GERAL">GERAL</option>
    </datalist>

    <div>
      {
        isModalOpen && (
          <>
          <div className="modal">
            <div className="modal-content">
              <span className="close-button" onClick={()=> setIsModalOpen(false)}>&times;</span>
              <h2>Editar produto</h2>
              <label>Nome do produto:</label>
              <input 
              type="text"
              value={editingProduct.productSelect}
              onChange={(e) => setEditingProduct({...editingProduct, productSelect: e.target.value.toUpperCase()})}
              />
              <label>Quantidade a ser comprada:</label>
              <input 
              type="text"
              value={editingProduct.quantity}
              onChange={(e) => setEditingProduct({...editingProduct, quantity: e.target.value.toUpperCase()})}
              />
              <label>Nome do fornecedor/local:</label>
              <input 
              type="text"
              value={editingProduct.supplier}
              onChange={(e) => setEditingProduct({...editingProduct, supplier: e.target.value.toUpperCase()})}
              />
              <button onClick={saveEditProduct}>Salvar alterações</button>
            </div>
          </div>
          </>
        )
      }
    </div>
    
    <div className="section-table">
      <table id="table-to-print">
        <thead>
          <tr>
            <th>ID</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Fornecedor</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {shoppingList.map((item)=> (
            <tr key={item.countId}>
              <td data-label='ID'>{item.countId}</td>
              <td data-label='Produto'>{item.productSelect}</td>
              <td data-label='Quantidade' id="quantityTable">{item.quantity}</td>
              <td data-label='Fornecedor'>{item.supplier}</td>
              <td data-label='Ações' className="functions">
                <img onClick={()=> editingProductSelect(item)} className="buttons-functions" src={editButton} alt="button-edit" />
                <img onClick={()=> deleteProduct(item.countId)} className="buttons-functions" src={deletButton} alt="button-delet" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}
