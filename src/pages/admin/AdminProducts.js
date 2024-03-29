import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ProductModal } from "../../components/ProductModal";
import { DeleteModal } from "../../components/DeleteModal";
import { Modal } from "bootstrap";

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  // type: 決定 modal 展開的用途
  const [type, setType] = useState("create"); // 預設展開: create 編輯: edit
  const [tempProduct, setTempProduct] = useState({}); // 點選編輯的時候會暫存

  const productModal = useRef(null);
  const deleteModal = useRef(null);

  useEffect(() => {
    productModal.current = new Modal("#productModal", { backdrop: "static" });

    deleteModal.current = new Modal("#deleteModal", { backdrop: "static" });
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/products`
      );
      console.log(response);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  const openProductModal = (type, product) => {
    setType(type);
    setTempProduct(product);
    productModal.current.show();
  };

  const closeProductModal = () => {
    productModal.current.hide();
  };

  const openDeleteModal = (product) => {
    setTempProduct(product);
    deleteModal.current.show();
  };

  const closeDeleteModal = () => {
    deleteModal.current.hide();
  };

  const deleteProduct = async (id) => {
    try {
      const res = await axios.delete(
        `/v2/api/${process.env.REACT_APP_API_PATH}/admin/product/${id}`
      );
      console.log(res);
      if (res.data.success) {
        getProducts();
        deleteModal.current.hide();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="p-3">
        <ProductModal
          closeProductModal={closeProductModal}
          getProducts={getProducts}
          type={type}
          tempProduct={tempProduct}
        />
        <DeleteModal
          text={tempProduct.title}
          close={closeDeleteModal}
          handleDelete={deleteProduct}
          id={tempProduct.id}
        />
        <h3>產品列表</h3>
        <hr />
        <div className="text-end">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => openProductModal("create", {})}
          >
            建立新商品
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">分類</th>
              <th scope="col">名稱</th>
              <th scope="col">售價</th>
              <th scope="col">啟用狀態</th>
              <th scope="col">編輯</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <tr key={product.id}>
                  <td>{product.category}</td>
                  <td>{product.title}</td>
                  <td>{product.price}</td>
                  <td>{product.is_enabled ? "啟動" : "未啟用"}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => openProductModal("edit", product)}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => openDeleteModal(product)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link disabled" href="/" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            {[...new Array(5)].map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <li className="page-item" key={`${i}_page`}>
                <a className={`page-link ${i + 1 === 1 && "active"}`} href="/">
                  {i + 1}
                </a>
              </li>
            ))}
            <li className="page-item">
              <a className="page-link" href="/" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
